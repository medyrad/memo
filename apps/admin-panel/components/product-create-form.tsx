"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "../lib/api";
import { createInventory, createProduct, createProductImage, createVariant } from "../lib/api";

export function ProductCreateForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const product = await createProduct({
        title: String(data.get("title")), slug: String(data.get("slug")), category: String(data.get("category")) || null,
        status: String(data.get("status")) as "draft" | "active" | "archived",
        short_description: String(data.get("short_description") ?? ""), long_description: String(data.get("long_description") ?? ""),
        seo_title: String(data.get("seo_title") ?? ""), seo_description: String(data.get("seo_description") ?? ""),
      });
      const variant = await createVariant({
        product: product.id, sku: String(data.get("sku")), price: String(data.get("price")), compare_at_price: null,
        color: String(data.get("color") ?? ""), material: String(data.get("material") ?? ""), size: String(data.get("size") ?? ""), is_active: true,
      });
      await createInventory({ variant: variant.id, quantity: Number(data.get("quantity")), reserved_quantity: 0, low_stock_threshold: Number(data.get("low_stock_threshold") ?? 3) });
      const externalUrl = String(data.get("external_url") ?? "").trim();
      if (externalUrl) await createProductImage({ product: product.id, external_url: externalUrl, alt_text: product.title, sort_order: 0, is_primary: true });
      router.push(`/products/${product.id}`); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "ذخیره محصول ناموفق بود."); setBusy(false); }
  }
  return <form className="panel admin-form" onSubmit={submit}>
    <div className="form-grid">
      <label>نام محصول<input name="title" required /></label><label>اسلاگ<input name="slug" dir="ltr" required /></label>
      <label>دسته‌بندی<select name="category" required><option value="">انتخاب کنید</option>{categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label>وضعیت<select name="status"><option value="draft">پیش‌نویس</option><option value="active">فعال</option><option value="archived">آرشیو</option></select></label>
      <label>SKU<input name="sku" dir="ltr" required /></label><label>قیمت (تومان)<input name="price" type="number" min="0" required /></label>
      <label>موجودی<input name="quantity" type="number" min="0" required /></label><label>هشدار کم‌موجودی<input name="low_stock_threshold" type="number" min="0" defaultValue="3" /></label>
      <label>رنگ<input name="color" /></label><label>جنس<input name="material" /></label><label>سایز<input name="size" /></label>
      <label>URL تصویر اصلی<input name="external_url" dir="ltr" type="url" /></label>
      <label className="form-wide">توضیح کوتاه<textarea name="short_description" /></label><label className="form-wide">توضیح کامل<textarea name="long_description" rows={5} /></label>
      <label>عنوان SEO<input name="seo_title" /></label><label>توضیح SEO<input name="seo_description" /></label>
    </div>
    <button className="button" disabled={busy}>{busy ? "در حال ذخیره…" : "ایجاد محصول و موجودی"}</button>{message && <p className="form-error">{message}</p>}
  </form>;
}

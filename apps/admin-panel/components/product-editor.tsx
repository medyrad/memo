"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "../lib/api";
import { createInventory, createProductImage, createVariant, deleteProduct, deleteProductImage, deleteVariant, updateProduct, updateVariant } from "../lib/api";

export function ProductEditor({ initial, categories }: { initial: Product; categories: Category[] }) {
  const router = useRouter(); const [product, setProduct] = useState(initial); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const d = new FormData(event.currentTarget);
    try {
      const saved = await updateProduct(product.id, { title: String(d.get("title")), slug: String(d.get("slug")), category: String(d.get("category")) || null, status: String(d.get("status")) as Product["status"], short_description: String(d.get("short_description")), long_description: String(d.get("long_description")), seo_title: String(d.get("seo_title")), seo_description: String(d.get("seo_description")) });
      setProduct({ ...product, ...saved }); setMessage("اطلاعات محصول ذخیره شد."); router.refresh();
    } catch (e) { setMessage(e instanceof Error ? e.message : "خطا در ذخیره"); } finally { setBusy(false); }
  }
  async function addVariant(form: HTMLFormElement) {
    const d = new FormData(form); const variant = await createVariant({ product: product.id, sku: String(d.get("sku")), price: String(d.get("price")), compare_at_price: null, color: "", material: "", size: "", is_active: true });
    const inventory = await createInventory({ variant: variant.id, quantity: Number(d.get("quantity")), reserved_quantity: 0, low_stock_threshold: Number(d.get("low_stock_threshold")) });
    setProduct(p => ({ ...p, variants: [...p.variants, { ...variant, available_quantity: inventory.available_quantity ?? inventory.quantity }] })); form.reset();
  }
  return <div className="admin-stack">
    <form className="panel admin-form" onSubmit={save}><div className="form-grid">
      <label>نام<input name="title" defaultValue={product.title} required /></label><label>اسلاگ<input name="slug" dir="ltr" defaultValue={product.slug} required /></label>
      <label>دسته<select name="category" defaultValue={product.category ?? ""}>{categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label>وضعیت<select name="status" defaultValue={product.status}><option value="draft">پیش‌نویس</option><option value="active">فعال</option><option value="archived">آرشیو</option></select></label>
      <label className="form-wide">توضیح کوتاه<textarea name="short_description" defaultValue={product.short_description} /></label><label className="form-wide">توضیح کامل<textarea rows={5} name="long_description" defaultValue={product.long_description} /></label>
      <label>عنوان SEO<input name="seo_title" defaultValue={product.seo_title} /></label><label>توضیح SEO<input name="seo_description" defaultValue={product.seo_description} /></label>
    </div><div className="form-actions"><button className="button" disabled={busy}>ذخیره تغییرات</button><button type="button" className="danger-button" onClick={async()=>{if(confirm("محصول حذف شود؟")){await deleteProduct(product.id);router.push("/products");router.refresh();}}}>حذف محصول</button></div>{message && <p>{message}</p>}</form>
    <section className="panel"><h2>تنوع‌ها</h2>{product.variants.map(v => <form className="inline-editor" key={v.id} onSubmit={async e=>{e.preventDefault();const d=new FormData(e.currentTarget);const saved=await updateVariant(v.id,{price:String(d.get("price")),is_active:d.get("is_active")==="on"});setProduct(p=>({...p,variants:p.variants.map(x=>x.id===v.id?saved:x)}));}}><b dir="ltr">{v.sku}</b><input name="price" type="number" defaultValue={Number(v.price)} /><label><input name="is_active" type="checkbox" defaultChecked={v.is_active}/> فعال</label><span>موجود: {v.available_quantity}</span><button>ذخیره</button><button type="button" className="text-danger" onClick={async()=>{await deleteVariant(v.id);setProduct(p=>({...p,variants:p.variants.filter(x=>x.id!==v.id)}));}}>حذف</button></form>)}
      <form className="inline-editor" onSubmit={async e=>{e.preventDefault();await addVariant(e.currentTarget);}}><input name="sku" dir="ltr" placeholder="SKU جدید" required/><input name="price" type="number" min="0" placeholder="قیمت" required/><input name="quantity" type="number" min="0" placeholder="موجودی" required/><input name="low_stock_threshold" type="number" min="0" defaultValue="3" aria-label="آستانه کم‌موجودی"/><button className="button">افزودن تنوع</button></form>
    </section>
    <section className="panel"><h2>تصاویر</h2><div className="media-grid">{product.images.map(img=><figure key={img.id}>{img.image_url ? <img src={img.image_url} alt={img.alt_text}/> : null}<figcaption>{img.alt_text}</figcaption><button onClick={async()=>{await deleteProductImage(img.id);setProduct(p=>({...p,images:p.images.filter(x=>x.id!==img.id)}));}}>حذف</button></figure>)}</div>
      <form className="inline-editor" onSubmit={async e=>{e.preventDefault();const d=new FormData(e.currentTarget);const img=await createProductImage({product:product.id,external_url:String(d.get("url")),alt_text:product.title,sort_order:product.images.length,is_primary:product.images.length===0});setProduct(p=>({...p,images:[...p.images,img]}));e.currentTarget.reset();}}><input name="url" type="url" dir="ltr" placeholder="https://…" required/><button className="button">افزودن تصویر</button></form>
    </section>
  </div>;
}

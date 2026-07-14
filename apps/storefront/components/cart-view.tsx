"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Heart, RefreshCw, Trash2 } from "lucide-react";
import { getCurrentCart, removeCartItem, setCartItemQuantity, type Cart } from "../lib/cart";
import type { CatalogProduct } from "../lib/catalog-types";
import { ProductCard } from "./product-card";
import { CheckoutStepper, TrustStrip } from "./order-ui";

const toman = (value: number | string) => `${Number(value).toLocaleString("fa-IR")} تومان`;

export function CartView({ suggestions }: { suggestions: CatalogProduct[] }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setCart(await getCurrentCart()); } catch { setError("دریافت سبد خرید انجام نشد."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function update(itemId: string, quantity: number) {
    try { await setCartItemQuantity(itemId, quantity); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : "به‌روزرسانی انجام نشد."); }
  }
  async function remove(itemId: string) {
    try { await removeCartItem(itemId); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : "حذف انجام نشد."); }
  }
  async function clear() {
    await Promise.all((cart?.items ?? []).map((item) => removeCartItem(item.id)));
    await load();
  }

  if (loading) return <div className="ms-catalog-empty"><p>در حال دریافت سبد خرید…</p></div>;
  if (error && !cart) return <div className="ms-catalog-empty"><h2>سبد خرید در دسترس نیست</h2><p>{error}</p><button className="ms-dark-button" onClick={load}><RefreshCw size={17}/> تلاش دوباره</button></div>;

  const items = cart?.items ?? [];
  return <div className="ms-checkout-page">
    <div className="ms-breadcrumb">خانه / سبد خرید</div>
    <div className="ms-page-heading"><h1>سبد خرید</h1><p>{items.length.toLocaleString("fa-IR")} کالا در سبد خرید شما</p></div>
    <CheckoutStepper active={1}/>
    {error ? <p className="ms-form-status">{error}</p> : null}
    {!items.length ? <div className="ms-catalog-empty"><h2>سبد خرید شما خالی است</h2><p>از کاتالوگ واقعی فروشگاه محصول دلخواهتان را انتخاب کنید.</p><Link className="ms-dark-button" href="/products">مشاهده محصولات</Link></div> : <div className="ms-cart-layout">
      <aside className="ms-order-summary"><h2>خلاصه سفارش</h2><dl><div><dt>جمع کالاها</dt><dd>{toman(cart?.subtotal ?? 0)}</dd></div><div className="is-payable"><dt>مبلغ کالاها</dt><dd>{toman(cart?.subtotal ?? 0)}</dd></div></dl><Link className="ms-dark-button" href="/checkout">ادامه فرایند خرید</Link></aside>
      <section className="ms-cart-table" aria-label="محصولات سبد خرید">
        <div className="ms-cart-head"><span>محصول</span><span>قیمت واحد</span><span>تعداد</span><span>قیمت کل</span></div>
        {items.map((item) => <article className="ms-cart-row" key={item.id}>
          <div className="ms-cart-product">{item.image_url ? <img src={item.image_url} alt={item.product_title}/> : <div className="ms-mini-product"/>}<div><Link href={`/products/${item.product_slug}`}>{item.product_title}</Link><p>SKU: {item.sku}</p></div></div>
          <strong>{toman(item.unit_price)}</strong>
          <div className="ms-qty"><button disabled={item.quantity <= 1} onClick={() => update(item.id, item.quantity - 1)}>−</button><span>{item.quantity.toLocaleString("fa-IR")}</span><button onClick={() => update(item.id, item.quantity + 1)}>+</button></div>
          <strong>{toman(item.line_total)}</strong>
          <div className="ms-cart-actions"><button onClick={() => remove(item.id)} aria-label={`حذف ${item.product_title}`}><Trash2 size={18}/></button><button type="button" aria-label="علاقه‌مندی"><Heart size={18}/></button></div>
        </article>)}
        <div className="ms-cart-bottom"><button onClick={clear}><Trash2 size={17}/> پاک‌کردن سبد خرید</button></div>
      </section>
    </div>}
    {suggestions.length ? <section className="ms-section"><div className="ms-section-head"><h2>محصولات پیشنهادی برای شما</h2></div><div className="ms-product-grid is-four">{suggestions.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section> : null}
    <TrustStrip/>
  </div>;
}

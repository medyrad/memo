"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "./product-card";
import { CheckoutStepper, OrderMiniImage, StaticOrderSummary, TrustStrip } from "./order-ui";
import { checkoutLines, suggestedProducts, toman } from "../lib/order-data";

export function CartView() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(checkoutLines.map((line) => [line.id, line.quantity])),
  );

  return (
    <div className="ms-checkout-page">
      <div className="ms-breadcrumb">خانه / سبد خرید</div>
      <div className="ms-page-heading">
        <h1>سبد خرید</h1>
        <p>{checkoutLines.length.toLocaleString("fa-IR")} کالا در سبد خرید شما</p>
      </div>
      <CheckoutStepper active={1} />
      <div className="ms-cart-layout">
        <StaticOrderSummary compact />
        <section className="ms-cart-table" aria-label="محصولات سبد خرید">
          <div className="ms-cart-head">
            <span>محصول</span>
            <span>قیمت واحد</span>
            <span>تعداد</span>
            <span>قیمت کل</span>
          </div>
          {checkoutLines.map((line) => {
            const quantity = quantities[line.id] ?? 1;
            return (
              <article className="ms-cart-row" key={line.id}>
                <div className="ms-cart-product">
                  <OrderMiniImage line={line} />
                  <div>
                    <Link href={`/products/${line.slug}`}>{line.title}</Link>
                    <p>{line.subtitle}</p>
                  </div>
                </div>
                <strong>{toman(line.unitPrice)}</strong>
                <div className="ms-qty">
                  <button onClick={() => setQuantities((current) => ({ ...current, [line.id]: Math.max(1, quantity - 1) }))} type="button">−</button>
                  <span>{quantity.toLocaleString("fa-IR")}</span>
                  <button onClick={() => setQuantities((current) => ({ ...current, [line.id]: quantity + 1 }))} type="button">+</button>
                </div>
                <strong>{toman(line.unitPrice * quantity)}</strong>
                <div className="ms-cart-actions">
                  <button type="button" aria-label="حذف">⌫</button>
                  <button type="button" aria-label="علاقه‌مندی">♡</button>
                </div>
              </article>
            );
          })}
          <div className="ms-cart-bottom">
            <button type="button">⌫ پاک کردن سبد خرید</button>
          </div>
        </section>
      </div>
      <section className="ms-section">
        <div className="ms-section-head">
          <h2>محصولات پیشنهادی برای شما</h2>
        </div>
        <div className="ms-product-grid is-four">
          {suggestedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
      <TrustStrip />
    </div>
  );
}

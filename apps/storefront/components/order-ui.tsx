import Link from "next/link";
import { ProductVisual } from "./product-card";
import { checkoutLines, orderTotals, profileOrders, toman, type CheckoutLine } from "../lib/order-data";
import { BadgeCheck, Bell, Camera, Check, Gift, Grid2X2, Headphones, Heart, LogOut, MapPin, Package, RotateCcw, ShoppingBag, Truck, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StepperProps = {
  active: 1 | 2 | 3;
  failed?: boolean;
};

export function CheckoutStepper({ active, failed = false }: StepperProps) {
  const steps = ["سبد خرید", "اطلاعات ارسال", "پرداخت"];
  return (
    <div className="ms-stepper" aria-label="مراحل خرید">
      {steps.map((step, index) => {
        const number = index + 1;
        const isDone = number < active || (!failed && number === active && active === 3);
        const isActive = number === active;
        return (
          <div className={`ms-step ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`} key={step}>
            <span>{isDone ? <Check size={16}/> : number.toLocaleString("fa-IR")}</span>
            <b>{step}</b>
          </div>
        );
      })}
    </div>
  );
}

export function OrderMiniImage({ line, compact = false }: { line: CheckoutLine; compact?: boolean }) {
  return <ProductVisual className={compact ? "ms-mini-product is-compact" : "ms-mini-product"} visual={line.visual} />;
}

export function StaticOrderSummary({ compact = false, showCoupon = true }: { compact?: boolean; showCoupon?: boolean }) {
  return (
    <aside className={`ms-order-summary ${compact ? "is-compact" : ""}`}>
      <div className="ms-summary-title">
        <h3>خلاصه سفارش</h3>
        <span>{checkoutLines.length.toLocaleString("fa-IR")} کالا</span>
      </div>
      <div className="ms-summary-lines">
        {checkoutLines.map((line) => (
          <div className="ms-summary-line" key={line.id}>
            <OrderMiniImage compact line={line} />
            <div>
              <b>{line.title}</b>
              <small>{line.subtitle}</small>
              <span>{toman(line.unitPrice)}</span>
            </div>
            <em>۱×</em>
          </div>
        ))}
      </div>
      <dl className="ms-totals">
        <div><dt>جمع جزئی</dt><dd>{toman(orderTotals.subtotal)}</dd></div>
        <div><dt>تخفیف (MEMO10)</dt><dd className="is-red">-{toman(orderTotals.discount)}</dd></div>
        <div><dt>هزینه ارسال</dt><dd className="is-green">رایگان</dd></div>
        <div className="is-payable"><dt>مبلغ قابل پرداخت</dt><dd>{toman(compact ? orderTotals.payable : orderTotals.checkoutPayable)}</dd></div>
      </dl>
      {showCoupon ? (
        <div className="ms-coupon">
          <input placeholder="کد تخفیف خود را وارد کنید" />
          <button type="button">اعمال</button>
        </div>
      ) : null}
    </aside>
  );
}

export function TrustStrip({ dense = false }: { dense?: boolean }) {
  const items: Array<[LucideIcon, string, string]> = [
    [BadgeCheck, "ضمانت اصالت کالا", "کالای اورجینال با ضمانت"],
    [RotateCcw, "۷ روز ضمانت بازگشت", "مرجوعی آسان و بدون پرسش"],
    [Truck, "ارسال سریع", "ارسال به سراسر ایران"],
    [Headphones, "پشتیبانی ۲۴/۷", "همیشه کنار شما هستیم"],
  ];
  return (
    <section className={`ms-checkout-trust ${dense ? "is-dense" : ""}`}>
      {items.map(([Icon, title, text]) => (
        <div key={title}>
          <Icon size={24}/>
          <b>{title}</b>
          <small>{text}</small>
        </div>
      ))}
    </section>
  );
}

export function AccountSidebar() {
  const menu: Array<[string, LucideIcon, string]> = [
    ["داشبورد", Grid2X2, "/profile"], ["اطلاعات حساب", UserRound, "/profile"],
    ["سفارش‌های من", ShoppingBag, "/profile/orders"], ["آدرس‌ها", MapPin, "/profile/addresses"],
    ["علاقه‌مندی‌ها", Heart, "/wishlist"], ["اطلاع‌رسانی", Bell, "/profile"],
  ];
  return (
    <aside className="ms-account-sidebar">
      <div className="ms-profile-avatar">
        <span />
        <button type="button" aria-label="تغییر تصویر"><Camera size={16}/></button>
      </div>
      <h3>سارا احمدی</h3>
      <p>۰۹۱۲۳۴۵۶۷۸۹</p>
      <b className="ms-gold-pill">عضو طلایی ♢</b>
      <nav>
        {menu.map(([label, Icon, href]) => (
          <Link className={label === "سفارش‌های من" ? "is-active" : ""} href={href} key={label}>
            <Icon size={20}/>
            {label}
          </Link>
        ))}
      </nav>
      <Link className="ms-logout" href="/auth/login"><LogOut size={20}/> خروج</Link>
    </aside>
  );
}

export function OrderStatusBadge({ tone, label }: { tone: string; label: string }) {
  return <span className={`ms-status-badge tone-${tone}`}>● {label}</span>;
}

export function OrderProgress({ active = 2 }: { active?: 1 | 2 | 3 | 4 }) {
  const steps = ["ثبت سفارش", "آماده‌سازی", "ارسال", "تحویل"];
  return (
    <div className="ms-order-progress">
      {steps.map((step, index) => {
        const number = index + 1;
        return (
          <div className={`${number <= active ? "is-active" : ""}`} key={step}>
            <span>{number === 1 && active >= 1 ? <Check size={16}/> : number.toLocaleString("fa-IR")}</span>
            <b>{step}</b>
            <small>{number === active ? "در حال " + step : number < active ? "تکمیل شده" : "در انتظار"}</small>
          </div>
        );
      })}
    </div>
  );
}

export function ProfileOrderRow({ index }: { index: number }) {
  const order = profileOrders[index];
  return (
    <article className={`ms-profile-order ${index === 0 ? "is-featured" : ""}`}>
      <div className="ms-profile-order-main">
        <OrderStatusBadge label={order.status} tone={order.statusTone} />
        <strong># {order.number}</strong>
        <span>{order.date}</span>
        <span>وضعیت پرداخت: پرداخت شده</span>
      </div>
      <div className="ms-profile-order-products">
        {order.items.slice(0, 3).map((line) => <OrderMiniImage compact key={line.id} line={line} />)}
        <small>{order.items.length.toLocaleString("fa-IR")} کالا</small>
      </div>
      <div className="ms-profile-order-pay">
        <b>{toman(order.amount)}</b>
        <span className="ms-paid">پرداخت شده</span>
        <Link className="ms-dark-button" href={`/profile/orders/${order.id}`}>پیگیری سفارش</Link>
      </div>
      {index === 0 ? <OrderProgress active={2} /> : null}
    </article>
  );
}

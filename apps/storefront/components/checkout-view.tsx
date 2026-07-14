"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckoutStepper, StaticOrderSummary, TrustStrip } from "./order-ui";
import { createCheckoutOrder, startPayment } from "../lib/checkout";
import { createAddress } from "../lib/addresses";
import { CreditCard, MapPin, NotepadText, Truck, UserRound } from "lucide-react";

export function CheckoutView() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    try {
      const form = new FormData(event.currentTarget);
      const address = await createAddress({
        recipient_name: `${form.get("first_name") ?? ""} ${form.get("last_name") ?? ""}`.trim(),
        phone: String(form.get("phone") ?? ""),
        province: String(form.get("province") ?? ""),
        city: String(form.get("city") ?? ""),
        postal_code: String(form.get("postal_code") ?? ""),
        address_line: String(form.get("address_line") ?? ""),
        title: "آدرس سفارش",
      });
      const order = await createCheckoutOrder({
        addressId: address.id,
        couponCode: String(form.get("coupon_code") ?? ""),
        shippingMethod: String(form.get("shipping")) === "express" ? "express" : "standard",
        customerNote: String(form.get("customer_note") ?? ""),
      });
      const payment = await startPayment(order.id, crypto.randomUUID());
      if (!payment.payment_url) throw new Error("آدرس درگاه پرداخت دریافت نشد.");
      window.location.assign(payment.payment_url);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "ثبت سفارش با خطا روبه‌رو شد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="ms-checkout-page">
      <div className="ms-breadcrumb">خانه / سبد خرید / اطلاعات ارسال / پرداخت</div>
      <div className="ms-page-heading">
        <h1>تکمیل خرید</h1>
      </div>
      <CheckoutStepper active={2} />
      <form className="ms-checkout-layout" onSubmit={handleCheckout}>
        <StaticOrderSummary />
        <section className="ms-checkout-form">
          <div className="ms-form-panel">
            <h2>اطلاعات گیرنده <UserRound size={22}/></h2>
            <div className="ms-field-grid">
              <label>نام<span>*</span><input name="first_name" required /></label>
              <label>نام خانوادگی<span>*</span><input name="last_name" required /></label>
              <label>شماره موبایل<span>*</span><input inputMode="tel" name="phone" pattern="[۰-۹0-9+]{10,14}" required /></label>
              <label>ایمیل (اختیاری)<input name="email" type="email" /></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>آدرس ارسال <MapPin size={22}/></h2>
            <div className="ms-field-grid">
              <label>استان<span>*</span><input name="province" required /></label>
              <label>شهر<span>*</span><input name="city" required /></label>
              <label>کد پستی<span>*</span><input inputMode="numeric" name="postal_code" pattern="[۰-۹0-9]{10}" required /></label>
              <label className="is-wide">آدرس کامل<span>*</span><input name="address_line" required /></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>روش ارسال <Truck size={22}/></h2>
            <div className="ms-choice-grid">
              <label className="ms-choice"><input defaultChecked name="shipping" type="radio" value="standard" /> <b>ارسال عادی</b><small>تحویل ۳ تا ۵ روز کاری</small><em>رایگان</em></label>
              <label className="ms-choice"><input name="shipping" type="radio" value="express" /> <b>ارسال سریع</b><small>تحویل ۱ تا ۲ روز کاری</small><em>۳۹,۰۰۰ تومان</em></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>روش پرداخت <CreditCard size={22}/></h2>
            <div className="ms-choice-grid">
              <label className="ms-choice is-selected"><input defaultChecked name="payment" type="radio" /> <b>پرداخت آنلاین</b><small>پرداخت از طریق درگاه بانکی</small></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>یادداشت سفارش <NotepadText size={22}/></h2>
            <textarea name="customer_note" placeholder="اگر نکته‌ای در مورد سفارش خود دارید، اینجا بنویسید..." />
            <label>کد تخفیف<input name="coupon_code" placeholder="در صورت داشتن کد وارد کنید" /></label>
          </div>
          {status ? <p className="ms-form-status">{status}</p> : null}
          <div className="ms-checkout-actions">
            <Link href="/cart">بازگشت به سبد خرید</Link>
            <button className="ms-dark-button" disabled={isSubmitting} type="submit">{isSubmitting ? "در حال انتقال به درگاه..." : "ادامه و پرداخت"}</button>
          </div>
        </section>
      </form>
      <TrustStrip />
    </div>
  );
}

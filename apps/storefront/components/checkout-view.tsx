"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckoutStepper, StaticOrderSummary, TrustStrip } from "./order-ui";
import { createCheckoutOrder, startPayment } from "../lib/checkout";
import { CreditCard, MapPin, NotepadText, Truck, UserRound } from "lucide-react";

export function CheckoutView() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    try {
      const order = await createCheckoutOrder("MEMO10");
      await startPayment(order.id);
      setStatus("سفارش ثبت شد. برای تست صفحه نتیجه می‌توانید از دکمه ادامه استفاده کنید.");
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
              <label>نام<span>*</span><input defaultValue="سارا" /></label>
              <label>نام خانوادگی<span>*</span><input defaultValue="احمدی" /></label>
              <label>شماره موبایل<span>*</span><input defaultValue="۰۹۱۲۳۴۵۶۷۸۹" /></label>
              <label>ایمیل (اختیاری)<input defaultValue="sara@email.com" /></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>آدرس ارسال <MapPin size={22}/></h2>
            <div className="ms-field-grid">
              <label>استان<span>*</span><select defaultValue="tehran"><option value="tehran">تهران</option></select></label>
              <label>شهر<span>*</span><select defaultValue="tehran-city"><option value="tehran-city">تهران</option></select></label>
              <label>کد پستی<span>*</span><input defaultValue="۱۲۳۴۵۶۷۸۹۰" /></label>
              <label className="is-wide">آدرس کامل<span>*</span><input defaultValue="تهران، خیابان ولیعصر، خیابان مطهری، پلاک ۲۴، واحد ۳" /></label>
              <label className="is-wide">پلاک / واحد (اختیاری)<input defaultValue="واحد ۳" /></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>روش ارسال <Truck size={22}/></h2>
            <div className="ms-choice-grid">
              <label className="ms-choice"><input name="shipping" type="radio" /> <b>ارسال عادی</b><small>تحویل ۳ تا ۵ روز کاری</small><em>رایگان</em></label>
              <label className="ms-choice is-selected"><input defaultChecked name="shipping" type="radio" /> <b>ارسال سریع</b><small>تحویل ۱ تا ۲ روز کاری</small><em>۳۹,۰۰۰ تومان</em></label>
              <label className="ms-choice"><input name="shipping" type="radio" /> <b>تحویل اکسپرس</b><small>تحویل همان روز تهران</small><em>۹۹,۰۰۰ تومان</em></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>روش پرداخت <CreditCard size={22}/></h2>
            <div className="ms-choice-grid">
              <label className="ms-choice is-selected"><input defaultChecked name="payment" type="radio" /> <b>پرداخت آنلاین</b><small>پرداخت از طریق درگاه بانکی</small></label>
              <label className="ms-choice"><input name="payment" type="radio" /> <b>پرداخت از کیف پول</b><small>موجودی کیف پول: ۵۲۸,۰۰۰ تومان</small></label>
              <label className="ms-choice"><input name="payment" type="radio" /> <b>پرداخت در محل</b><small>محدود به شهر تهران</small></label>
            </div>
          </div>
          <div className="ms-form-panel">
            <h2>یادداشت سفارش <NotepadText size={22}/></h2>
            <textarea placeholder="اگر نکته‌ای در مورد سفارش خود دارید، اینجا بنویسید..." />
          </div>
          {status ? <p className="ms-form-status">{status}</p> : null}
          <div className="ms-checkout-actions">
            <Link href="/cart">بازگشت به سبد خرید</Link>
            <Link className="ms-dark-button" href="/checkout/success">ادامه و پرداخت</Link>
            <button disabled={isSubmitting} type="submit">{isSubmitting ? "در حال ثبت..." : "ثبت تست سفارش"}</button>
          </div>
        </section>
      </form>
      <TrustStrip />
    </div>
  );
}

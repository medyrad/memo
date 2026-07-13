import Link from "next/link";
import { CheckoutStepper, StaticOrderSummary, TrustStrip } from "../../../components/order-ui";
import { CreditCard, Headphones, X } from "lucide-react";

export default function PaymentFailurePage() {
  const reasons = [
    ["قطع ارتباط بانکی", "در هنگام انتقال به درگاه بانکی، ارتباط قطع شده است."],
    ["انصراف از پرداخت", "شما عملیات پرداخت را قبل از تکمیل لغو کرده‌اید."],
    ["موجودی ناکافی", "موجودی حساب شما کافی نبوده است."],
    ["خطای درگاه پرداخت", "خطایی در سمت درگاه رخ داده است. لطفا مجددا تلاش کنید."],
  ];

  return (
    <main className="ms-container">
      <div className="ms-result-page">
        <div className="ms-breadcrumb">خانه / سبد خرید / اطلاعات ارسال / پرداخت / پرداخت ناموفق</div>
        <div className="ms-page-heading"><h1>پرداخت ناموفق</h1></div>
        <CheckoutStepper active={3} failed />
        <section className="ms-payment-result is-failure">
          <div className="ms-result-icon"><X/></div>
          <h1>پرداخت ناموفق بود</h1>
          <p>متاسفانه پرداخت شما تکمیل نشد. مبلغی از حساب شما کسر نشده یا در صورت کسر، طی زمان اعلامی بانک بازخواهد گشت.</p>
          <div className="ms-failure-meta">
            <div><span>شماره سفارش موقت</span><b>TMP-65789214</b></div>
            <div><span>روش پرداخت</span><b>پرداخت آنلاین (درگاه بانکی)</b></div>
            <div><span>تاریخ و زمان</span><b>۱۴۰۳/۰۳/۳۰ - ۱۲:۴۸</b></div>
          </div>
          <div className="ms-failure-grid">
            <div className="ms-reason-list">
              <h2>دلایل احتمالی</h2>
              {reasons.map(([title, text]) => (
                <article key={title}>
                  <span>!</span>
                  <div><b>{title}</b><p>{text}</p></div>
                </article>
              ))}
            </div>
            <StaticOrderSummary compact showCoupon={false} />
          </div>
        </section>
        <div className="ms-result-actions">
          <Link href="/contact">تماس با پشتیبانی <Headphones size={18}/></Link>
          <Link href="/cart">بازگشت به سبد خرید</Link>
          <Link href="/checkout">تغییر روش پرداخت <CreditCard size={18}/></Link>
          <Link className="ms-dark-button" href="/checkout">تلاش مجدد برای پرداخت</Link>
        </div>
        <TrustStrip dense />
      </div>
    </main>
  );
}

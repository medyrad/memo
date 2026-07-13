import Link from "next/link";
import { CheckoutStepper, StaticOrderSummary, TrustStrip } from "../../../components/order-ui";
import { Check, MapPin, Truck } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="ms-container">
      <div className="ms-result-page">
        <div className="ms-breadcrumb">خانه / سبد خرید / اطلاعات ارسال / پرداخت / پرداخت موفق</div>
        <CheckoutStepper active={3} />
        <section className="ms-payment-result is-success">
          <div className="ms-result-icon"><Check/></div>
          <h1>پرداخت شما با موفقیت انجام شد</h1>
          <p>سفارش شما ثبت شد و به زودی برای آماده‌سازی ارسال می‌شود.</p>
          <div className="ms-success-grid">
            <div className="ms-result-meta">
              <div><span>شماره سفارش</span><b>MS-1403-000856</b></div>
              <div><span>کد پیگیری پرداخت</span><b>PAY-A51F-7279-9921</b></div>
              <div><span>تاریخ و زمان ثبت سفارش</span><b>۱۴۰۳/۰۳/۲۲ - ۱۲:۴۵</b></div>
              <div><span>روش پرداخت</span><b>پرداخت آنلاین (زرین‌پال)</b></div>
              <div><span>وضعیت سفارش</span><b className="is-green">در حال آماده‌سازی</b></div>
            </div>
            <div className="ms-address-box">
              <h3>آدرس ارسال <MapPin size={18}/></h3>
              <b>سارا احمدی</b>
              <p>۰۹۱۲۳۴۵۶۷۸۹</p>
              <p>تهران، خیابان ولیعصر، خیابان مطهری، پلاک ۲۴، واحد ۳</p>
              <p>کد پستی: ۱۲۳۴۵۶۷۸۹۰</p>
              <hr />
              <h3>زمان تقریبی ارسال <Truck size={18}/></h3>
              <b>بین ۲۶ تا ۲۸ اردیبهشت ۱۴۰۳</b>
              <p>(۲ تا ۳ روز کاری)</p>
            </div>
          </div>
        </section>
        <StaticOrderSummary compact={false} showCoupon={false} />
        <div className="ms-result-actions">
          <Link href="/">بازگشت به فروشگاه</Link>
          <Link href="/profile/orders">مشاهده سفارش‌ها</Link>
          <Link className="ms-dark-button" href="/profile/orders/MS-1403-000856">پیگیری سفارش <Truck size={18}/></Link>
        </div>
        <TrustStrip dense />
      </div>
    </main>
  );
}

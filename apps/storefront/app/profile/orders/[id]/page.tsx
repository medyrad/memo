import Link from "next/link";
import { AccountSidebar, OrderMiniImage, OrderProgress, TrustStrip } from "../../../../components/order-ui";
import { ProductVisual } from "../../../../components/product-card";
import { checkoutLines, orderTotals, suggestedProducts, toman } from "../../../../lib/order-data";

export default function OrderDetailPage() {
  return (
    <main className="ms-container">
      <div className="ms-account-page">
        <div className="ms-breadcrumb">خانه / حساب کاربری / سفارش‌های من / جزئیات سفارش</div>
        <div className="ms-account-layout">
          <AccountSidebar />
          <section className="ms-account-content">
            <div className="ms-page-heading">
              <h1>جزئیات سفارش</h1>
              <p>اطلاعات کامل سفارش، وضعیت ارسال و جزئیات پرداخت را در اینجا ببینید.</p>
            </div>
            <div className="ms-detail-stats">
              <div><span>تحویل تخمینی</span><b>۱۴۰۴/۰۳/۲۲</b></div>
              <div><span>وضعیت سفارش</span><b className="is-warm">در حال آماده‌سازی</b></div>
              <div><span>وضعیت پرداخت</span><b className="is-green">پرداخت شده</b></div>
              <div><span>تاریخ سفارش</span><b>۱۴۰۴/۰۲/۱۵</b></div>
              <div><span>شماره سفارش</span><b>#۱۰۳۴۵۶</b></div>
            </div>
            <div className="ms-shipping-methods">
              <div><span>روش ارسال</span><b>ارسال سریع</b></div>
              <div><span>روش پرداخت</span><b>آنلاین</b></div>
            </div>
            <OrderProgress active={2} />
            <div className="ms-order-detail-grid">
              <section>
                <h2>اطلاعات ارسال ⌖</h2>
                <dl>
                  <div><dt>نام گیرنده</dt><dd>سارا احمدی</dd></div>
                  <div><dt>شماره موبایل</dt><dd>۰۹۱۲۳۴۵۶۷۸۹</dd></div>
                  <div><dt>آدرس</dt><dd>تهران، خیابان ولیعصر، خیابان مطهری، پلاک ۲۴، واحد ۴، طبقه ۲</dd></div>
                  <div><dt>کد پستی</dt><dd>۱۲۳۴۵۶۷۸۹۰</dd></div>
                </dl>
                <p className="ms-eta">تحویل تخمینی: ۱۴۰۴/۰۳/۲۲ تا ۱۴۰۴/۰۳/۲۷</p>
              </section>
              <section>
                <h2>جزئیات پرداخت ▭</h2>
                <dl>
                  <div><dt>روش پرداخت</dt><dd>آنلاین (زرین‌بانک)</dd></div>
                  <div><dt>کد پیگیری پرداخت</dt><dd>PGW-14040315-8845</dd></div>
                  <div><dt>شماره فاکتور</dt><dd>INV-۱۰۳۴۵۶</dd></div>
                  <div><dt>جمع کل کالاها</dt><dd>{toman(orderTotals.subtotal)}</dd></div>
                  <div><dt>تخفیف</dt><dd>-{toman(orderTotals.discount)}</dd></div>
                  <div><dt>هزینه ارسال</dt><dd>رایگان</dd></div>
                  <div className="is-total"><dt>مبلغ قابل پرداخت</dt><dd>{toman(1026000)}</dd></div>
                </dl>
              </section>
            </div>
            <section className="ms-products-table">
              <h2>محصولات سفارش ▢</h2>
              {checkoutLines.map((line) => (
                <div key={line.id}>
                  <OrderMiniImage compact line={line} />
                  <b>{line.title}<small>کد: {line.sku}</small></b>
                  <span>{line.subtitle}</span>
                  <span>۱</span>
                  <span>{toman(line.unitPrice)}</span>
                  <strong>{toman(line.unitPrice)}</strong>
                </div>
              ))}
              <footer>جمع کل سفارش <b>{toman(1290000)}</b></footer>
            </section>
            <div className="ms-result-actions">
              <Link href="/profile/orders">بازگشت به سفارش‌ها</Link>
              <Link href="/contact">درخواست پشتیبانی ☏</Link>
              <Link href="/profile/orders">پیگیری مرسوله ▤</Link>
              <Link className="ms-outline-warm" href="/profile/orders">بازگشت به سفارش‌ها</Link>
            </div>
            <section className="ms-slim-suggestions">
              <h2>ممکن است این محصولات را نیز دوست داشته باشید ✦</h2>
              <div>
                {suggestedProducts.map((product) => (
                  <Link href={`/products/${product.slug}`} key={product.id}>
                    <ProductVisual className="ms-mini-product" visual={product.visual} />
                    <b>{product.title}</b>
                    <span>{toman(product.price)}</span>
                    <em>+</em>
                  </Link>
                ))}
              </div>
            </section>
          </section>
        </div>
        <TrustStrip dense />
      </div>
    </main>
  );
}

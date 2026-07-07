import Link from "next/link";
import { ProductCard, ProductVisual } from "../components/product-card";
import { categoryTiles, showcaseProducts } from "../lib/showcase-data";

const bestSellers = showcaseProducts.slice(0, 5);

export default function HomePage() {
  return (
    <main>
      <section className="ms-home-hero">
        <div className="ms-container ms-home-hero-inner">
          <div className="ms-hero-copy">
            <h1>زیبایی در جزئیات است<br />استایل تو، امضای تو</h1>
            <p>اکسسوری‌های خاص برای زنان خاص</p>
            <Link className="ms-dark-button" href="/categories/necklaces">مشاهده کالکشن جدید</Link>
          </div>
        </div>
      </section>

      <section className="ms-container">
        <div className="ms-category-row">
          {categoryTiles.map((category) => (
            <Link className="ms-category-tile" href={`/categories/${category.slug}`} key={category.slug}>
              <ProductVisual visual={category.visual} />
              <b>{category.title}</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="ms-container ms-section">
        <div className="ms-section-head">
          <Link className="ms-view-all" href="/products">مشاهده همه</Link>
          <h2>پرفروش‌ترین‌ها</h2>
        </div>
        <div className="ms-product-grid">
          {bestSellers.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </section>

      <section className="ms-container ms-promo-grid">
        <article className="ms-promo">
          <div>
            <p>کالکشن جدید</p>
            <h2>بهار ۱۴۰۴</h2>
            <Link className="ms-dark-button" href="/products">مشاهده کنید</Link>
          </div>
          <div className="ms-promo-art" />
        </article>
        <article className="ms-promo">
          <div>
            <p>هدیه‌ای خاص برای</p>
            <h2>کسی که دوستش داری</h2>
            <Link className="ms-dark-button" href="/categories/gifts">انتخاب هدیه</Link>
          </div>
          <div className="ms-promo-art" />
        </article>
      </section>

      <section className="ms-container">
        <div className="ms-benefits">
          {[
            ["پشتیبانی ۲۴/۷", "همیشه کنار شما هستیم"],
            ["پرداخت امن", "با درگاه‌های معتبر"],
            ["ارسال سریع", "ارسال به سراسر ایران"],
            ["۷ روز ضمانت بازگشت", "مرجوعی آسان و بدون پرسش"],
            ["ضمانت اصالت کالا", "کالای اورجینال با ضمانت"],
          ].map(([title, text]) => (
            <div className="ms-benefit" key={title}>
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ms-container ms-section">
        <div className="ms-section-head">
          <Link className="ms-view-all" href="#">مشاهده بیشتر</Link>
          <h2>در اینستاگرام با ما همراه باشید</h2>
        </div>
        <div className="ms-instagram-grid">
          {["heart", "earrings", "bracelet", "coin", "pearl-ring"].map((visual) => (
            <ProductVisual visual={visual} key={visual} />
          ))}
        </div>
      </section>
    </main>
  );
}


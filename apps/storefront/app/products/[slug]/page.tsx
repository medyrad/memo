import { notFound } from "next/navigation";
import { AddToCartButton } from "../../../components/add-to-cart-button";
import { ProductCard, ProductVisual } from "../../../components/product-card";
import { getShowcaseProduct, showcaseProducts } from "../../../lib/showcase-data";
import { Heart } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getShowcaseProduct(params.slug);
  if (!product) notFound();

  const related = showcaseProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <main className="ms-container">
      <div className="ms-breadcrumb">خانه / {product.categoryTitle} / {product.title}</div>
      <section className="ms-product-detail">
        <div>
          <ProductVisual visual={product.visual} className="ms-detail-gallery-main" />
          <div className="ms-detail-thumbs">
            <ProductVisual visual={product.visual} />
            <ProductVisual visual="coin" />
            <ProductVisual visual="plaque" />
            <ProductVisual visual="bracelet" />
          </div>
        </div>

        <div className="ms-detail-info">
          <h1>{product.title}</h1>
          <div className="ms-detail-meta">
            <span className="ms-rating">★★★★★</span>
            <span>{product.reviewCount} نظر مشتری</span>
            <span>کد محصول: {product.variantId}</span>
          </div>
          <div className="ms-detail-price">
            <strong>{product.price.toLocaleString("fa-IR")} تومان</strong>
            {product.compareAtPrice ? <del>{product.compareAtPrice.toLocaleString("fa-IR")} تومان</del> : null}
            {product.badge ? <span className="ms-badge">{product.badge}</span> : null}
          </div>
          <p className="muted">{product.description} این گردنبند از متریال ضدحساسیت ساخته شده و انتخابی ایده‌آل برای استفاده روزمره و هدیه‌های ماندگار است.</p>

          <div className="ms-option-group">
            <b>رنگ:</b>
            <div className="ms-option-list">
              <span className="ms-option is-active">طلایی</span>
              <span className="ms-option">نقره‌ای</span>
              <span className="ms-option">رزگلد</span>
            </div>
          </div>
          <div className="ms-option-group">
            <b>طول زنجیر:</b>
            <div className="ms-option-list">
              <span className="ms-option">۴۰ سانتی‌متر</span>
              <span className="ms-option is-active">{product.chainLength ?? "۴۵ سانتی‌متر"}</span>
              <span className="ms-option">۵۰ سانتی‌متر</span>
            </div>
          </div>

          <div className="ms-purchase-box">
            <AddToCartButton variantId={product.variantId} />
            <button className="ms-outline-button" type="button">افزودن به علاقه‌مندی‌ها <Heart size={18}/></button>
          </div>

          <div className="ms-trust-strip">
            <span>ضمانت اصالت</span>
            <span>بسته‌بندی هدیه</span>
            <span>ارسال سریع</span>
            <span>۷ روز ضمانت بازگشت</span>
          </div>
          <div className="ms-delivery-box">
            <span><b>موجود در انبار</b><br />آماده ارسال</span>
            <span><b>پرداخت امن</b><br />پرداخت آنلاین امن</span>
          </div>
        </div>
      </section>

      <section className="ms-tabs">
        <div className="ms-tabs-nav">
          <span>توضیحات محصول</span>
          <span>مشخصات</span>
          <span>نحوه نگهداری</span>
          <span>نظرات کاربران ({product.reviewCount})</span>
        </div>
        <div className="ms-tab-body">
          <ul>
            <li>{product.description}</li>
            <li>طراحی مینیمال و ظریف مناسب استفاده روزمره و مهمانی</li>
            <li>آبکاری طلا با کیفیت بالا و مقاومت در برابر رطوبت</li>
            <li>قفل محکم و ایمن برای اطمینان بیشتر</li>
          </ul>
        </div>
      </section>

      <section className="ms-reviews-layout">
        <aside className="ms-review-score">
          <h2>نظرات کاربران</h2>
          <strong>{product.rating.toLocaleString("fa-IR")}</strong>
          <span>از ۵ ({product.reviewCount} نظر)</span>
          <div className="ms-rating">★★★★★</div>
        </aside>
        <div className="ms-review-list">
          {["نرگس محمدی", "سارا رحیمی"].map((name, index) => (
            <article className="ms-review" key={name}>
              <ProductVisual visual={index ? "earrings" : product.visual} />
              <div>
                <b>{name}</b>
                <span className="ms-rating">★★★★★</span>
                <p className="muted">خیلی ظریف و خوش‌رنگه، دقیقاً همون چیزی بود که می‌خواستم. بسته‌بندی هم تمیز و شیک بود.</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ms-section">
        <div className="ms-section-head">
          <span className="ms-view-all">مشاهده همه</span>
          <h2>محصولات مرتبط</h2>
        </div>
        <div className="ms-product-grid">
          {related.map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
      </section>
    </main>
  );
}

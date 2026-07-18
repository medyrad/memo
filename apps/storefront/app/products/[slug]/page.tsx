import { notFound } from "next/navigation";
import { AddToCartButton } from "../../../components/add-to-cart-button";
import { ProductCard, ProductVisual } from "../../../components/product-card";
import { getProduct, getProducts, getReviews } from "../../../lib/api";
import { toCatalogProduct } from "../../../lib/catalog";
import { WishlistButton } from "../../../components/wishlist-button";
import type { Metadata } from "next";
import { absoluteUrl, jsonLd } from "../../../lib/seo";

export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{
  const product=await getProduct(params.slug); if(!product)return {title:"محصول پیدا نشد",robots:{index:false,follow:false}};
  const image=product.images?.find(item=>item.is_primary)?.image_url||product.images?.[0]?.image_url;
  return {title:product.seo_title||product.title,description:product.seo_description||product.short_description,alternates:{canonical:`/products/${product.slug}`},openGraph:{type:"website",url:absoluteUrl(`/products/${product.slug}`),title:product.seo_title||product.title,description:product.seo_description||product.short_description,images:image?[{url:image,alt:product.title}]:undefined}};
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const apiProduct = await getProduct(params.slug);
  if (!apiProduct) notFound();
  const product = toCatalogProduct(apiProduct);
  const reviews = await getReviews(apiProduct.id);

  const related = (await getProducts(`category__slug=${encodeURIComponent(apiProduct.category_slug ?? "")}`))
    .filter((item) => item.id !== apiProduct.id)
    .slice(0, 4)
    .map(toCatalogProduct);
  const productUrl=absoluteUrl(`/products/${apiProduct.slug}`); const primaryImage=apiProduct.images?.find(item=>item.is_primary)?.image_url||apiProduct.images?.[0]?.image_url;
  const productSchema={"@context":"https://schema.org","@type":"Product",name:apiProduct.title,description:apiProduct.long_description||apiProduct.short_description,sku:apiProduct.variants?.[0]?.sku,image:primaryImage?[primaryImage]:undefined,url:productUrl,brand:{"@type":"Brand",name:"memostyles"},aggregateRating:apiProduct.review_count?{"@type":"AggregateRating",ratingValue:apiProduct.rating||0,reviewCount:apiProduct.review_count}:undefined,offers:{"@type":"Offer",url:productUrl,priceCurrency:"IRR",price:String(Number(apiProduct.variants?.[0]?.price||0)*10),availability:(apiProduct.variants?.[0]?.available_quantity||0)>0?"https://schema.org/InStock":"https://schema.org/OutOfStock",itemCondition:"https://schema.org/NewCondition"}};
  const breadcrumbSchema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"خانه",item:absoluteUrl("/")},{"@type":"ListItem",position:2,name:apiProduct.category_title||"محصولات",item:absoluteUrl(apiProduct.category_slug?`/categories/${apiProduct.category_slug}`:"/products")},{"@type":"ListItem",position:3,name:apiProduct.title,item:productUrl}]};

  return (
    <main className="ms-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(productSchema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbSchema)}}/>
      <div className="ms-breadcrumb">خانه / {product.categoryTitle} / {product.title}</div>
      <section className="ms-product-detail">
        <div>
          <ProductVisual visual={product.visual} src={product.imageUrl} alt={product.title} className="ms-detail-gallery-main" />
          <div className="ms-detail-thumbs">
            {(apiProduct.images ?? []).map((image) => <ProductVisual key={image.id} visual={product.visual} src={image.image_url || image.image || undefined} alt={image.alt_text || product.title}/>) }
          </div>
        </div>

        <div className="ms-detail-info">
          <h1>{product.title}</h1>
          <div className="ms-detail-meta">
            <span className="ms-rating">★★★★★</span>
            <span>{reviews.length.toLocaleString("fa-IR")} نظر مشتری</span>
            <span>کد محصول: {apiProduct.variants?.[0]?.sku}</span>
          </div>
          <div className="ms-detail-price">
            <strong>{product.price.toLocaleString("fa-IR")} تومان</strong>
            {product.compareAtPrice ? <del>{product.compareAtPrice.toLocaleString("fa-IR")} تومان</del> : null}
            {product.badge ? <span className="ms-badge">{product.badge}</span> : null}
          </div>
          <p className="muted">{product.description}</p>

          <div className="ms-option-group">
            <b>رنگ:</b>
            <div className="ms-option-list">
              {[...new Set((apiProduct.variants ?? []).map((variant) => variant.color).filter(Boolean))].map((color, index) => <span className={`ms-option ${index === 0 ? "is-active" : ""}`} key={color}>{color}</span>)}
            </div>
          </div>
          <div className="ms-option-group">
            <b>طول زنجیر:</b>
            <div className="ms-option-list">
              {[...new Set((apiProduct.variants ?? []).map((variant) => variant.size).filter(Boolean))].map((size, index) => <span className={`ms-option ${index === 0 ? "is-active" : ""}`} key={size}>{size}</span>)}
            </div>
          </div>

          <div className="ms-purchase-box">
            <AddToCartButton variantId={(product.availableQuantity ?? 0) > 0 ? product.variantId : undefined} />
            <WishlistButton productId={apiProduct.id}/>
          </div>

          <div className="ms-trust-strip">
            <span>ضمانت اصالت</span>
            <span>بسته‌بندی هدیه</span>
            <span>ارسال سریع</span>
            <span>۷ روز ضمانت بازگشت</span>
          </div>
          <div className="ms-delivery-box">
            <span><b>{(product.availableQuantity ?? 0) > 0 ? "موجود در انبار" : "ناموجود"}</b><br />{(product.availableQuantity ?? 0) > 0 ? `${product.availableQuantity} عدد آماده ارسال` : "امکان سفارش وجود ندارد"}</span>
            <span><b>پرداخت امن</b><br />پرداخت آنلاین امن</span>
          </div>
        </div>
      </section>

      <section className="ms-tabs">
        <div className="ms-tabs-nav">
          <span>توضیحات محصول</span>
          <span>مشخصات</span>
          <span>نحوه نگهداری</span>
          <span>نظرات کاربران ({reviews.length.toLocaleString("fa-IR")})</span>
        </div>
        <div className="ms-tab-body">
          <ul>
            <li>{product.description}</li>
            {(apiProduct.attributes ?? []).map((attribute: { id: string; name: string; value: string }) => <li key={attribute.id}>{attribute.name}: {attribute.value}</li>)}
          </ul>
        </div>
      </section>

      <section className="ms-reviews-layout">
        <aside className="ms-review-score">
          <h2>نظرات کاربران</h2>
          <strong>{product.rating.toLocaleString("fa-IR")}</strong>
          <span>از ۵ ({reviews.length.toLocaleString("fa-IR")} نظر)</span>
          <div className="ms-rating">★★★★★</div>
        </aside>
        <div className="ms-review-list">
          {reviews.map((review) => (
            <article className="ms-review" key={review.id}>
              <div>
                <b>{review.title || "خریدار محصول"}</b>
                <span className="ms-rating">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                <p className="muted">{review.body}</p>
              </div>
            </article>
          ))}
          {!reviews.length ? <div className="ms-catalog-empty"><p>هنوز نظری برای این محصول ثبت نشده است.</p></div> : null}
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

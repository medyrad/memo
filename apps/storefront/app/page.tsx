import Link from "next/link";
import { ProductCard, ProductVisual } from "../components/product-card";
import { getBanners, getCategories, getHomepageSections, getProducts } from "../lib/api";
import { toCatalogProduct } from "../lib/catalog";
import type { Metadata } from "next";
import { absoluteUrl, jsonLd } from "../lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [apiProducts, categories, banners, sections] = await Promise.all([
    getProducts("ordering=-created_at"), getCategories(), getBanners("home-hero"), getHomepageSections(),
  ]);
  const products = apiProducts.map(toCatalogProduct);
  const hero = banners[0];
  const rail = sections.find((section) => section.kind === "product_rail");
  const categoryCards = categories.slice(0, 4).map((category) => ({
    ...category,
    image: products.find((product) => product.category === category.slug)?.imageUrl,
  }));

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({
        "@context":"https://schema.org", "@type":"Organization", name:"memostyles", url:absoluteUrl("/"),
        logo:absoluteUrl("/icon"), contactPoint:{"@type":"ContactPoint",contactType:"customer service",availableLanguage:"fa"},
        sameAs:["https://instagram.com/memostyles"],
      })}} />
      <section className="ms-home-hero" style={hero?.image_url ? { backgroundImage: `linear-gradient(90deg, rgba(245,238,230,.12), rgba(245,238,230,.82)), url(${hero.image_url})` } : undefined}>
        <div className="ms-container ms-home-hero-inner"><div className="ms-hero-copy">
          <h1>{hero?.title ?? "زیبایی در جزئیات است"}<br />{hero?.subtitle ?? "استایل تو، امضای تو"}</h1>
          <p>اکسسوری‌های خاص برای زنان خاص</p>
          <Link className="ms-dark-button" href={hero?.link_url || "/products"}>مشاهده کالکشن جدید</Link>
        </div></div>
      </section>
      <section className="ms-container"><div className="ms-category-row">
        {categoryCards.map((category) => <Link className="ms-category-tile" href={`/categories/${category.slug}`} key={category.id}><ProductVisual visual={category.slug} src={category.image} alt={category.title}/><b>{category.title}</b></Link>)}
      </div></section>
      <section className="ms-container ms-section"><div className="ms-section-head"><Link className="ms-view-all" href={rail?.link_url || "/products"}>{rail?.link_text || "مشاهده همه"}</Link><h2>{rail?.title || "پرفروش‌ترین‌ها"}</h2></div>
        {products.length ? <div className="ms-product-grid">{products.slice(0, 8).map((product) => <ProductCard product={product} key={product.id}/>)}</div> : <div className="ms-catalog-empty"><h2>کاتالوگ در حال آماده‌سازی است</h2><p>محصولات فعال پنل مدیریت اینجا نمایش داده می‌شوند.</p></div>}
      </section>
      <section className="ms-container ms-promo-grid">
        {categories.slice(0, 2).map((category) => <article className="ms-promo" key={category.id}><div><p>کالکشن منتخب</p><h2>{category.title}</h2><Link className="ms-dark-button" href={`/categories/${category.slug}`}>مشاهده کنید</Link></div><div className="ms-promo-art"/></article>)}
      </section>
      <section className="ms-container"><div className="ms-benefits">{[["پشتیبانی ۲۴/۷","همیشه کنار شما هستیم"],["پرداخت امن","با درگاه معتبر"],["ارسال سریع","ارسال به سراسر ایران"],["۷ روز ضمانت بازگشت","مرجوعی آسان"],["ضمانت اصالت کالا","کنترل کیفیت پیش از ارسال"]].map(([title,text]) => <div className="ms-benefit" key={title}><b>{title}</b><span>{text}</span></div>)}</div></section>
    </main>
  );
}

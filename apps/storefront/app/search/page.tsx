import Link from "next/link";
import { Breadcrumbs, CatalogProductCard, MsIcon, PageTitle, ProductRail } from "../../components/storefront-page-kit";
import { showcaseProducts } from "../../lib/showcase-data";

export const metadata = {
  title: "جستجو | memostyles",
};

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() || "گردنبند";
  const results = showcaseProducts.filter((product) => `${product.title} ${product.categoryTitle} ${product.description}`.includes(query) || query === "گردنبند").slice(0, 12);

  return (
    <main className="ms-container ms-static-page">
      <Breadcrumbs items={[["جستجو"]]} />
      <section className="ms-search-layout">
        <aside className="ms-filter-panel">
          <h2>فیلتر محصولات <MsIcon name="filter" /></h2>
          <div className="ms-filter-section"><h3>دسته‌بندی</h3>{["همه گردنبندها (۲۴۸)", "گردنبند طلا (۸۷)", "گردنبند نقره (۶۳)", "گردنبند سنگ (۵۱)", "گردنبند مروارید (۳۲)"].map((item, index) => <label className="ms-check-row" key={item}>{item}<input type="checkbox" defaultChecked={index === 0} /></label>)}</div>
          <div className="ms-filter-section"><h3>قیمت (تومان)</h3><div className="ms-range"><span /><b /><span /></div><div className="ms-price-inputs"><input defaultValue="۲۰۰,۰۰۰" /><input defaultValue="۵,۰۰۰,۰۰۰" /></div></div>
          <div className="ms-filter-section"><h3>رنگ</h3><div className="ms-color-dots"><span style={{ background: "#d4a348" }} /><span style={{ background: "#cfd0d0" }} /><span style={{ background: "#dda495" }} /><span style={{ background: "#272524" }} /><span style={{ background: "#fff" }} /></div><button type="button" className="ms-more">مشاهده بیشتر</button></div>
          <div className="ms-filter-section"><h3>جنس</h3>{["طلا (۱۲۰)", "نقره (۶۵)", "استیل (۳۸)", "سنگ طبیعی (۴۴)", "مروارید (۱۰)"].map((item) => <label className="ms-check-row" key={item}>{item}<input type="checkbox" /></label>)}</div>
          <div className="ms-filter-section"><h3>موجودی</h3><label className="ms-check-row">فقط کالاهای موجود<input type="checkbox" /></label><label className="ms-check-row">فقط کالاهای تخفیف‌دار<input type="checkbox" /></label></div>
          <button className="ms-dark-button" type="button">اعمال فیلترها</button><button className="ms-clear" type="button">پاک کردن همه</button>
        </aside>

        <div className="ms-search-results">
          <PageTitle title={`نتایج جستجو برای "${query}"`} text={`ما ${results.length.toLocaleString("fa-IR")} محصول با کلمه "${query}" پیدا کردیم.`} icon={false} />
          <form className="ms-search-page-form" action="/search"><input name="q" defaultValue={query} /><button type="submit"><MsIcon name="search" /></button></form>
          <div className="ms-chip-row">{["پرطرفدار", "گردنبند طلا", "زیر میلیون تومان", "زنجیر ظریف", "آویز قلب", "گردنبند با سنگ"].map((chip) => <Link href={`/search?q=${chip}`} key={chip}>{chip}</Link>)}</div>
          <div className="ms-result-toolbar"><span>مرتب‌سازی:</span><select defaultValue="popular"><option value="popular">محبوب‌ترین</option><option>جدیدترین</option></select><button type="button"><MsIcon name="grid" /></button><button type="button"><MsIcon name="list" /></button></div>
          <div className="ms-product-grid is-four">{results.map((product) => <CatalogProductCard product={product} key={product.id} />)}</div>
        </div>
      </section>
      <section className="ms-related-searches"><h2>جستجوهای مرتبط</h2>{["گردنبند طلا", "گردنبند مروارید", "گردنبند دخترانه", "گردنبند با سنگ", "گردنبند قلب", "گردنبند نقره"].map((item) => <Link href={`/search?q=${item}`} key={item}>{item}</Link>)}</section>
      <ProductRail title="محصولات اخیرا مشاهده‌شده" products={showcaseProducts.slice(1, 6)} />
    </main>
  );
}

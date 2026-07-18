import { Breadcrumbs, CatalogProductCard, MsIcon } from "../../components/storefront-page-kit";
import { getProducts } from "../../lib/api";
import { toCatalogProduct } from "../../lib/catalog";

export const metadata = { title: "محصولات", description: "مشاهده و خرید آنلاین محصولات memostyles.", alternates: { canonical: "/products" } };

export default async function ProductsPage() {
  const apiProducts = await getProducts();
  const products = apiProducts.map(toCatalogProduct);
  const count = (slug: string) => apiProducts.filter((product) => product.category_slug === slug).length.toLocaleString("fa-IR");
  return (
    <main className="ms-container ms-catalog-page">
      <Breadcrumbs items={[["محصولات"]]} />
      <div className="ms-category-page">
        <aside className="ms-filter-panel">
          <h2>فیلتر محصولات <MsIcon name="filter" /></h2>
          <Filter title="دسته‌بندی" items={[`همه محصولات (${products.length.toLocaleString("fa-IR")})`, `گردنبند (${count("necklaces")})`, `دستبند (${count("bracelets")})`, `ست هدیه (${count("gifts")})`, `کیف (${count("bags")})`]} />
          <div className="ms-filter-section"><h3>قیمت (تومان)</h3><div className="ms-range"><span/><b/><span/></div><div className="ms-price-inputs"><input defaultValue="۲۰۰,۰۰۰"/><input defaultValue="۵,۰۰۰,۰۰۰"/></div></div>
          <Filter title="جنس" items={["استیل ضدحساسیت (۱۵۰)", "نقره ۹۲۵ (۸۱)", "طلای ۱۸ عیار (۴۱)", "برنج آبکاری (۳۴)"]} />
          <div className="ms-filter-section"><h3>رنگ</h3><div className="ms-color-dots">{["#d0a14f","#d8d8d8","#d9a396","#2f2b27","#fff"].map(color => <span key={color} style={{background:color}}/>)}</div><button className="ms-more" type="button">مشاهده بیشتر</button></div>
          <Filter title="مناسب برای" items={["روزمره (۱۴۸)", "مجلسی (۹۱)", "هدیه (۱۴۲)"]} />
          <button className="ms-dark-button ms-filter-submit" type="button">اعمال فیلترها</button><button className="ms-clear" type="button">پاک کردن همه</button>
        </aside>
        <section className="ms-catalog-results">
          <header className="ms-catalog-heading"><div><h1>همه محصولات</h1><p>{products.length.toLocaleString("fa-IR")} محصول</p></div><div className="ms-result-toolbar"><span>مرتب‌سازی:</span><select defaultValue="new"><option value="new">جدیدترین</option><option value="cheap">ارزان‌ترین</option></select><button className="is-active" type="button"><MsIcon name="grid"/></button><button type="button"><MsIcon name="list"/></button></div></header>
          {products.length ? <div className="ms-product-grid is-four">{products.map(product => <CatalogProductCard product={product} key={product.id}/>)}</div> : <div className="ms-catalog-empty"><h2>هنوز محصولی منتشر نشده است</h2><p>محصولات پس از ثبت در پنل مدیریت در این بخش نمایش داده می‌شوند.</p></div>}
        </section>
      </div>
    </main>
  );
}

function Filter({ title, items }: { title: string; items: string[] }) {
  return <div className="ms-filter-section"><h3>{title}</h3>{items.map((item,index) => <label className="ms-check-row" key={item}><span>{item}</span><input defaultChecked={index === 0} type="checkbox"/></label>)}</div>;
}

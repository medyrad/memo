import { ProductCard } from "../../../components/product-card";
import { getProducts } from "../../../lib/api";
import { toCatalogProduct } from "../../../lib/catalog";

const categoryTitles: Record<string, string> = {
  necklaces: "گردنبند",
  earrings: "گوشواره",
  bracelets: "دستبند",
  bags: "کیف",
  gifts: "هدیه",
};

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = (await getProducts(`category__slug=${encodeURIComponent(params.slug)}`)).map(toCatalogProduct);
  const title = categoryTitles[params.slug] ?? "محصولات";
  const list = products;

  return (
    <main className="ms-container">
      <div className="ms-breadcrumb">خانه / {title}</div>
      <div className="ms-category-page">
        <aside className="ms-filter-panel">
          <h3>فیلتر محصولات</h3>
          <div className="ms-filter-section">
            <b>دسته‌بندی</b>
            {["همه گردنبندها", "آویزدار", "چاکر", "مینیمال", "چند لایه"].map((item, index) => (
              <label className="ms-check-row" key={item}>
                <span>{item}</span>
                <input defaultChecked={index === 0} type="checkbox" />
              </label>
            ))}
          </div>
          <div className="ms-filter-section">
            <b>قیمت (تومان)</b>
            <div className="ms-check-row"><span>۲۰۰,۰۰۰</span><span>۵,۰۰۰,۰۰۰</span></div>
            <input defaultValue={80} type="range" style={{ width: "100%" }} />
          </div>
          <div className="ms-filter-section">
            <b>جنس</b>
            {["استیل ضدحساسیت", "نقره ۹۲۵", "طلای آبکاری", "برنج آبکاری"].map((item) => (
              <label className="ms-check-row" key={item}>
                <span>{item}</span>
                <input type="checkbox" />
              </label>
            ))}
          </div>
          <div className="ms-filter-section">
            <b>رنگ</b>
            <div className="ms-color-dots">
              {["#d0a14f", "#d8d8d8", "#d9a396", "#2f2b27", "#fff"].map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </div>
          </div>
          <div className="ms-filter-section">
            <b>طول زنجیر</b>
            {["زیر ۴۰ سانتی‌متر", "۴۰ تا ۴۵ سانتی‌متر", "۴۵ تا ۵۰ سانتی‌متر", "بیشتر از ۵۰ سانتی‌متر"].map((item) => (
              <label className="ms-check-row" key={item}>
                <span>{item}</span>
                <input type="checkbox" />
              </label>
            ))}
          </div>
          <button className="ms-dark-button" style={{ width: "100%" }} type="button">اعمال فیلترها</button>
          <p className="muted" style={{ textAlign: "center" }}>پاک کردن همه</p>
        </aside>

        <section>
          <div className="ms-category-toolbar">
            <div>
              <h1>{title}</h1>
              <p className="muted">{list.length.toLocaleString("fa-IR")} محصول</p>
            </div>
            <select className="ms-sort" defaultValue="popular">
              <option value="popular">پربازدیدترین</option>
              <option value="new">جدیدترین</option>
              <option value="price">قیمت</option>
            </select>
          </div>
          <div className="ms-product-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {list.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
          <nav className="ms-pagination">
            <a>قبلی</a>
            <span className="is-active">۱</span>
            <span>۲</span>
            <span>۳</span>
            <span>۴</span>
            <a>بعدی</a>
          </nav>
        </section>
      </div>
    </main>
  );
}

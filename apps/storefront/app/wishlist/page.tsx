import { Breadcrumbs, CatalogProductCard, MsIcon, PageTitle, ProductRail, ProfileSidebar } from "../../components/storefront-page-kit";
import { showcaseProducts } from "../../lib/showcase-data";

export const metadata = {
  title: "علاقه‌مندی‌ها | memostyles",
};

export default function WishlistPage() {
  const products = showcaseProducts.slice(0, 8);
  return (
    <main className="ms-container ms-account-page">
      <Breadcrumbs items={[["حساب کاربری", "/profile"], ["علاقه‌مندی‌ها"]]} />
      <PageTitle title="علاقه‌مندی‌ها" text="محصولاتی که دوست دارید را در اینجا مشاهده و مدیریت کنید." icon={false} />
      <section className="ms-account-layout">
        <ProfileSidebar active="wishlist" />
        <div className="ms-account-content">
          <div className="ms-wishlist-summary">
            <div><MsIcon name="heart" /><span>تعداد محصولات ذخیره‌شده</span><b>۸</b><small>محصول</small></div>
            <form>
              <button type="button" className="is-active">همه</button>
              <button type="button">موجود</button>
              <button type="button">تخفیف‌دار</button>
              <label>مرتب‌سازی:<select defaultValue="new"><option value="new">جدیدترین</option><option>محبوب‌ترین</option></select></label>
              <span><MsIcon name="grid" /><MsIcon name="list" /></span>
            </form>
          </div>
          <div className="ms-product-grid is-four">
            {products.map((product) => <CatalogProductCard product={product} removable key={product.id} />)}
          </div>
        </div>
      </section>
      <ProductRail title="شاید این‌ها هم مورد پسندتان باشد" products={showcaseProducts.slice(4, 10)} />
    </main>
  );
}

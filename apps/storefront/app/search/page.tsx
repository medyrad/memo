import Link from "next/link";
import { Breadcrumbs, CatalogProductCard, MsIcon, PageTitle, ProductRail } from "../../components/storefront-page-kit";
import { getProducts } from "../../lib/api";
import { toCatalogProduct } from "../../lib/catalog";

export const metadata = { title: "جستجو | memostyles" };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() || "";
  const all = await getProducts(query ? `search=${encodeURIComponent(query)}` : "");
  const results = all.map(toCatalogProduct);
  const suggestions = (query ? await getProducts() : all).slice(0, 6).map(toCatalogProduct);
  return <main className="ms-container ms-static-page">
    <Breadcrumbs items={[["جستجو"]]}/>
    <section className="ms-search-results" style={{maxWidth: "100%"}}>
      <PageTitle title={query ? `نتایج جستجو برای «${query}»` : "جستجوی محصولات"} text={`${results.length.toLocaleString("fa-IR")} محصول پیدا شد.`} icon={false}/>
      <form className="ms-search-page-form" action="/search"><input name="q" defaultValue={query} placeholder="نام محصول، دسته یا ویژگی..."/><button type="submit" aria-label="جستجو"><MsIcon name="search"/></button></form>
      <div className="ms-chip-row">{["گردنبند","دستبند","ست هدیه","کیف"].map((chip) => <Link href={`/search?q=${encodeURIComponent(chip)}`} key={chip}>{chip}</Link>)}</div>
      {results.length ? <div className="ms-product-grid is-four">{results.map((product) => <CatalogProductCard product={product} key={product.id}/>)}</div> : <div className="ms-catalog-empty"><h2>محصولی پیدا نشد</h2><p>عبارت دیگری امتحان کنید یا همه محصولات را ببینید.</p><Link className="ms-dark-button" href="/products">همه محصولات</Link></div>}
    </section>
    {suggestions.length ? <ProductRail title="پیشنهادهای فروشگاه" products={suggestions}/> : null}
  </main>;
}

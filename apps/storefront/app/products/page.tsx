import Link from "next/link";
import { getProducts } from "../../lib/api";

export const metadata = {
  title: "محصولات | memostyles",
};

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <main className="section">
      <h2>محصولات</h2>
      <p>گردنبند، گوشواره، دستبند و کیف‌های منتخب memostyles.</p>
      <div className="grid">
        {(products.length ? products : []).map((product) => (
          <Link className="product-card" href={`/products/${product.slug}`} key={product.id}>
            <h3>{product.title}</h3>
            <p>{product.short_description}</p>
            <span className="price">{product.variants?.[0]?.price ?? "قیمت ناموجود"}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}


import Link from "next/link";
import { PageFrame } from "../../components/page-frame";
import { getProducts } from "../../lib/api";

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <PageFrame title="محصولات" action={<Link className="button" href="/products/new">محصول جدید</Link>}>
      <div className="table">
        <div className="row"><strong>نام</strong><strong>وضعیت</strong><strong>موجودی</strong></div>
        {products.length ? products.map((product) => (
          <div className="row" key={product.id}>
            <Link href={`/products/${product.id}`}>{product.title}</Link>
            <span>{product.status}</span>
            <span>{product.variants?.length ?? 0} تنوع</span>
          </div>
        )) : (
          <div className="row"><span>محصولی ثبت نشده است.</span><span>-</span><span>-</span></div>
        )}
      </div>
    </PageFrame>
  );
}

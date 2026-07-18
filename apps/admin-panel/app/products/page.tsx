import Link from "next/link";
import { AlertTriangle, CheckCircle2, Edit3, FilePenLine, Layers3, Package, Plus } from "lucide-react";
import { PageFrame, StatusBadge } from "../../components/page-frame";
import { ProductDeleteButton } from "../../components/product-delete-button";
import { getProducts } from "../../lib/server-api";

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);
  const active=products.filter(p=>p.status==="active").length, drafts=products.filter(p=>p.status==="draft").length;
  const low=products.filter(p=>p.variants.some(v=>v.available_quantity<=3)).length;
  return <PageFrame title="مدیریت محصولات" description="کاتالوگ واقعی، تنوع‌ها، تصاویر و موجودی فروشگاه را مدیریت کنید.">
    <div className="metrics-grid metrics-four product-metrics">
      <article className="metric-card"><span className="metric-icon"><Layers3/></span><div><span>کل محصولات</span><strong>{products.length.toLocaleString("fa-IR")}</strong></div></article>
      <article className="metric-card"><span className="metric-icon green-icon"><CheckCircle2/></span><div><span>محصولات فعال</span><strong>{active.toLocaleString("fa-IR")}</strong></div></article>
      <article className="metric-card"><span className="metric-icon warning-icon"><AlertTriangle/></span><div><span>کم‌موجودی</span><strong>{low.toLocaleString("fa-IR")}</strong></div></article>
      <article className="metric-card"><span className="metric-icon"><FilePenLine/></span><div><span>پیش‌نویس</span><strong>{drafts.toLocaleString("fa-IR")}</strong></div></article>
    </div>
    <section className="card products-section"><div className="products-toolbar simple-toolbar"><p>اطلاعات این جدول مستقیماً از کاتالوگ خوانده می‌شود.</p><Link className="button add-product" href="/products/new"><Plus size={17}/> افزودن محصول</Link></div>
      <div className="responsive-table product-table"><table><thead><tr><th>تصویر</th><th>نام</th><th>SKU</th><th>دسته</th><th>قیمت</th><th>موجودی</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>{products.map(product=>{const variant=product.variants[0], image=product.images[0];return <tr key={product.id}><td>{image?.image_url?<img className="jewel-thumb image-thumb" src={image.image_url} alt=""/>:<span className="jewel-thumb"><Package/></span>}</td><td><strong>{product.title}</strong></td><td dir="ltr">{variant?.sku??"—"}</td><td>{product.category_title??"—"}</td><td>{variant?Number(variant.price).toLocaleString("fa-IR"):"—"} <small>تومان</small></td><td>{variant?.available_quantity??0}</td><td><StatusBadge tone={product.status==="active"?"success":product.status==="draft"?"info":"neutral"}>{product.status==="active"?"فعال":product.status==="draft"?"پیش‌نویس":"آرشیو"}</StatusBadge></td><td><div className="row-actions"><Link href={`/products/${product.id}`} title="ویرایش"><Edit3/></Link><ProductDeleteButton id={product.id}/></div></td></tr>})}</tbody></table>{!products.length&&<div className="empty-state">محصولی ثبت نشده است.</div>}</div>
      <div className="pagination"><span>نمایش {products.length.toLocaleString("fa-IR")} محصول</span></div>
    </section>
  </PageFrame>;
}

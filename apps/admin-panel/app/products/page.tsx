import Link from "next/link";
import { PageFrame, StatusBadge } from "../../components/page-frame";
import type { Product } from "../../lib/api";
import { getProducts } from "../../lib/server-api";
import { AlertTriangle, CheckCircle2, Copy, Edit3, Eye, FilePenLine, Layers3, Package, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";

const samples = [
  ["گردنبند قلب مینیمال", "NE-3304", "گردنبند", "۱,۲۸۰,۰۰۰", "۲۴", "فعال", "success"],
  ["گوشواره مروارید اشکی", "EA-2207", "گوشواره", "۹۸۰,۰۰۰", "۱۷", "فعال", "success"],
  ["دستبند زنجیری کلاسیک", "BR-1512", "دستبند", "۱,۱۵۰,۰۰۰", "۸", "کم موجودی", "warning"],
  ["کیف دوشی زنانه", "BG-2210", "کیف", "۲,۳۵۰,۰۰۰", "۰", "ناموجود", "danger"],
  ["انگشتر نگین‌دار تک‌نگین", "RI-4403", "انگشتر", "۷۵۰,۰۰۰", "۳۲", "فعال", "success"],
  ["ساعت مچی زنانه کلاسیک", "WT-4501", "ساعت", "۲,۶۸۰,۰۰۰", "۵", "پیش‌نویس", "info"],
  ["عینک آفتابی زنانه", "SG-1102", "اکسسوری", "۶۹۰,۰۰۰", "۱۵", "فعال", "success"],
  ["کش مو ساتن", "AC-3301", "اکسسوری", "۲۶۰,۰۰۰", "۵۰", "فعال", "success"],
] as const;

function rowFromApi(product: Product) {
  const variant = product.variants?.[0];
  return [product.title, variant?.sku ?? "—", "—", variant ? Number(variant.price).toLocaleString("fa-IR") : "—", String(product.variants?.length ?? 0), product.status === "active" ? "فعال" : product.status === "draft" ? "پیش‌نویس" : "آرشیو شده", product.status === "active" ? "success" : "info"] as const;
}

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);
  const rows = products.length ? products.map(rowFromApi) : samples;

  return (
    <PageFrame title="مدیریت محصولات" description="محصولات فروشگاه خود را مدیریت، ویرایش و سازماندهی کنید.">
      <div className="metrics-grid metrics-four product-metrics">
        <article className="metric-card"><span className="metric-icon"><Layers3/></span><div><span>کل محصولات</span><strong>۴۸۷</strong><p className="trend up">↑ ۶.۴٪ <em>نسبت به هفته قبل</em></p></div></article>
        <article className="metric-card"><span className="metric-icon green-icon"><CheckCircle2/></span><div><span>محصولات فعال</span><strong>۳۲۸</strong><p className="trend up">↑ ۹.۲٪ <em>نسبت به هفته قبل</em></p></div></article>
        <article className="metric-card"><span className="metric-icon warning-icon"><AlertTriangle/></span><div><span>محصولات کم‌موجودی</span><strong>۲۱</strong><p className="trend warning-text">↑ ۸.۳٪ <em>نسبت به هفته قبل</em></p></div></article>
        <article className="metric-card"><span className="metric-icon"><FilePenLine/></span><div><span>پیش‌نویس‌ها</span><strong>۱۸</strong><p className="trend up">↑ ۱۲.۵٪ <em>نسبت به هفته قبل</em></p></div></article>
      </div>
      <section className="card products-section">
        <div className="products-toolbar">
          <label className="field-search"><Search/><input placeholder="جستجوی نام محصول، SKU و ..." /></label>
          <select aria-label="مرتب‌سازی"><option>مرتب‌سازی: جدیدترین</option></select>
          <select aria-label="دسته‌بندی"><option>همه دسته‌بندی‌ها</option></select>
          <select aria-label="برند"><option>همه برندها</option></select>
          <button className="filter-button"><SlidersHorizontal size={17}/> فیلترها</button>
          <Link className="button add-product" href="/products/new"><Plus size={17}/> افزودن محصول</Link>
        </div>
        <div className="product-tabs"><button className="active">همه محصولات <b>۴۸۷</b></button><button>فعال <b>۳۲۸</b></button><button>پیش‌نویس <b>۱۸</b></button><button>ناموجود <b>۴۲</b></button><button>آرشیو شده <b>۲۳</b></button></div>
        <div className="responsive-table product-table"><table><thead><tr><th>تصویر</th><th>نام محصول</th><th>SKU</th><th>دسته‌بندی</th><th>قیمت</th><th>موجودی</th><th>وضعیت</th><th>تاریخ</th><th>عملیات</th></tr></thead><tbody>{rows.map(([name,sku,category,price,stock,status,tone], index) => <tr key={`${sku}-${index}`}><td><span className="jewel-thumb"><Package/></span></td><td><strong>{name}</strong></td><td dir="ltr">{sku}</td><td>{category}</td><td><strong>{price}</strong><small className="currency"> تومان</small></td><td>{stock}</td><td><StatusBadge tone={tone}>{status}</StatusBadge></td><td><span>۱۴۰۴/۰۲/۰۷</span><small className="cell-sub">۱۴:۳۳</small></td><td><div className="row-actions"><Link href={`/products/${products[index]?.id ?? index + 1}`} title="مشاهده"><Eye/></Link><button title="ویرایش"><Edit3/></button><button title="کپی"><Copy/></button><button className="delete" title="حذف"><Trash2/></button></div></td></tr>)}</tbody></table></div>
        <div className="pagination"><span>نمایش ۱ تا ۸ از ۴۸۷ مورد</span><div><button>بعدی</button><button>۴۹</button><span>…</span><button>۳</button><button>۲</button><button className="active">۱</button><button>قبلی</button></div><label>نمایش <select><option>۱۰</option></select> آیتم در صفحه</label></div>
      </section>
    </PageFrame>
  );
}

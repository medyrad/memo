import Link from "next/link";
import { CircleDollarSign, ShoppingCart, UsersRound, WalletCards } from "lucide-react";
import { PageFrame, StatusBadge } from "../../components/page-frame";
import { CategoryCharts, SalesChart } from "../../components/dashboard-charts";
import { getDashboard } from "../../lib/server-api";

const statusLabel: Record<string, string> = { draft:"پیش‌نویس", pending_payment:"در انتظار پرداخت", paid:"پرداخت‌شده", processing:"در حال پردازش", shipped:"ارسال‌شده", delivered:"تحویل‌شده", cancelled:"لغوشده", refunded:"مرجوع‌شده" };
const statusTone = (status:string) => status === "delivered" || status === "paid" ? "success" : status === "cancelled" || status === "refunded" ? "danger" : status === "shipped" ? "info" : "warning";
const money = (value:string|number) => Number(value).toLocaleString("fa-IR");

export default async function DashboardPage() {
  const data = await getDashboard().catch(() => null);
  const metrics = data?.metrics ?? { total_sales:"0", orders:0, customers:0, average_order_value:"0" };
  return <PageFrame title="داشبورد مدیریت" description="خلاصهٔ زندهٔ وضعیت فروشگاه بر اساس داده‌های ثبت‌شده.">
    <div className="metrics-grid metrics-four">
      <Metric icon={<CircleDollarSign/>} title="کل فروش" value={`${money(metrics.total_sales)} تومان`}/>
      <Metric icon={<ShoppingCart/>} title="سفارش‌ها" value={money(metrics.orders)}/>
      <Metric icon={<UsersRound/>} title="مشتریان" value={money(metrics.customers)}/>
      <Metric icon={<WalletCards/>} title="میانگین ارزش سفارش" value={`${money(metrics.average_order_value)} تومان`}/>
    </div>
    <div className="dashboard-live-grid">
      <article className="card"><h2>روند فروش هفت روز اخیر</h2><SalesChart data={data?.sales_series ?? []}/><Link className="card-link" href="/reports">مشاهده گزارش کامل ←</Link></article>
      <article className="card"><h2>فروش بر اساس دسته‌بندی</h2><CategoryCharts data={data?.category_sales ?? []}/><Link className="card-link" href="/reports">مشاهده جزئیات ←</Link></article>
    </div>
    <article className="card dashboard-orders"><h2>سفارش‌های اخیر</h2><div className="responsive-table"><table><thead><tr><th>شماره سفارش</th><th>مشتری</th><th>مبلغ</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>{data?.recent_orders.length ? data.recent_orders.map(order=><tr key={order.id}><td>{order.id.slice(0,8)}</td><td>{order.customer}</td><td>{money(order.total)} تومان</td><td><StatusBadge tone={statusTone(order.status)}>{statusLabel[order.status] ?? order.status}</StatusBadge></td><td><Link className="outline-small" href={`/orders/${order.id}`}>مشاهده</Link></td></tr>):<tr><td colSpan={5}>سفارشی ثبت نشده است.</td></tr>}</tbody></table></div></article>
  </PageFrame>;
}

function Metric({icon,title,value}:{icon:React.ReactNode;title:string;value:string}){return <article className="metric-card"><span className="metric-icon">{icon}</span><div><span>{title}</span><strong>{value}</strong></div></article>}

import { PageFrame } from "../../components/page-frame";

export default function DashboardPage() {
  return (
    <PageFrame title="داشبورد">
      <div className="grid">
        <div className="panel">فروش امروز<span className="metric">۰ تومان</span></div>
        <div className="panel">سفارش‌های باز<span className="metric">۰</span></div>
        <div className="panel">محصولات کم‌موجودی<span className="metric">۰</span></div>
        <div className="panel">مشتریان جدید<span className="metric">۰</span></div>
      </div>
    </PageFrame>
  );
}


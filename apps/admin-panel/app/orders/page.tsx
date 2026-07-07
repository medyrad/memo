import { PageFrame } from "../../components/page-frame";
import { getOrders } from "../../lib/api";

export default async function OrdersPage() {
  const orders = await getOrders().catch(() => []);

  return (
    <PageFrame title="سفارش‌ها">
      <div className="table">
        <div className="row"><strong>شماره</strong><strong>وضعیت</strong><strong>مبلغ</strong></div>
        {orders.length ? orders.map((order) => (
          <div className="row" key={order.id}>
            <span>{order.id}</span>
            <span>{order.status}</span>
            <span>{Number(order.grand_total).toLocaleString("fa-IR")} تومان</span>
          </div>
        )) : <div className="row"><span>سفارشی ثبت نشده است.</span><span>-</span><span>-</span></div>}
      </div>
    </PageFrame>
  );
}

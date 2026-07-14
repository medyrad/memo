import { PageFrame } from "../../components/page-frame";
import { getInventory } from "../../lib/server-api";

export default async function InventoryPage() {
  const inventory = await getInventory().catch(() => []);

  return (
    <PageFrame title="موجودی">
      <div className="table">
        <div className="row"><strong>تنوع</strong><strong>تعداد</strong><strong>وضعیت</strong></div>
        {inventory.length ? inventory.map((item) => (
          <div className="row" key={item.id}>
            <span>{item.variant}</span>
            <span>{item.quantity}</span>
            <span>{item.is_low_stock ? "کم‌موجودی" : "عادی"}</span>
          </div>
        )) : <div className="row"><span>موجودی ثبت نشده است.</span><span>-</span><span>-</span></div>}
      </div>
    </PageFrame>
  );
}

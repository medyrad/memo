import { PageFrame } from "../../components/page-frame";
import { getCustomers } from "../../lib/server-api";

export default async function CustomersPage() {
  const customers = await getCustomers().catch(() => []);

  return (
    <PageFrame title="مشتریان">
      <div className="table">
        <div className="row"><strong>نام کاربری</strong><strong>ایمیل</strong><strong>وضعیت</strong></div>
        {customers.length ? customers.map((customer) => (
          <div className="row" key={customer.id}>
            <span>{customer.username}</span>
            <span>{customer.email}</span>
            <span>{customer.is_active ? "فعال" : "غیرفعال"}</span>
          </div>
        )) : <div className="row"><span>مشتری ثبت نشده است.</span><span>-</span><span>-</span></div>}
      </div>
    </PageFrame>
  );
}

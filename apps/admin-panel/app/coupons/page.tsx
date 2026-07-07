import { PageFrame } from "../../components/page-frame";
import { getCoupons } from "../../lib/api";

export default async function CouponsPage() {
  const coupons = await getCoupons().catch(() => []);

  return (
    <PageFrame title="کوپن‌ها">
      <div className="table">
        <div className="row"><strong>کد</strong><strong>نوع</strong><strong>مقدار</strong></div>
        {coupons.length ? coupons.map((coupon) => (
          <div className="row" key={coupon.id}>
            <span>{coupon.code}</span>
            <span>{coupon.discount_type}</span>
            <span>{coupon.value}</span>
          </div>
        )) : <div className="row"><span>کوپنی ثبت نشده است.</span><span>-</span><span>-</span></div>}
      </div>
    </PageFrame>
  );
}

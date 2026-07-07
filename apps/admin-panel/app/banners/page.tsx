import { PageFrame } from "../../components/page-frame";
import { getBanners } from "../../lib/api";

export default async function BannersPage() {
  const banners = await getBanners().catch(() => []);

  return (
    <PageFrame title="بنرها">
      <div className="table">
        <div className="row"><strong>عنوان</strong><strong>جایگاه</strong><strong>وضعیت</strong></div>
        {banners.length ? banners.map((banner) => (
          <div className="row" key={banner.id}>
            <span>{banner.title}</span>
            <span>{banner.placement}</span>
            <span>{banner.is_active ? "فعال" : "غیرفعال"}</span>
          </div>
        )) : <div className="row"><span>بنری ثبت نشده است.</span><span>-</span><span>-</span></div>}
      </div>
    </PageFrame>
  );
}

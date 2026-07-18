import { BannerManager } from "../../components/cms-manager";
import { PageFrame } from "../../components/page-frame";
import { getBanners } from "../../lib/server-api";
export default async function BannersPage(){const banners=await getBanners().catch(()=>[]);return <PageFrame title="بنرها" description="اسلایدرها و بنرهای فروشگاه را بدون تغییر کد مدیریت کنید."><BannerManager initial={banners}/></PageFrame>}

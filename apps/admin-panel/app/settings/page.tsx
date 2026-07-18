import { SettingsManager } from "../../components/cms-manager";
import { PageFrame } from "../../components/page-frame";
import { getHomepageSections, getSiteSettings } from "../../lib/server-api";
export default async function SettingsPage(){const [sections,settings]=await Promise.all([getHomepageSections().catch(()=>[]),getSiteSettings().catch(()=>[])]);return <PageFrame title="مدیریت محتوای فروشگاه" description="صفحه اصلی، فوتر و اطلاعات تماس را مدیریت کنید."><SettingsManager initialSections={sections} initialSettings={settings}/></PageFrame>}

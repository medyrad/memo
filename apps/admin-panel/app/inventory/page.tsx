import { InventoryEditor } from "../../components/inventory-editor";
import { PageFrame } from "../../components/page-frame";
import { getInventory } from "../../lib/server-api";
export default async function InventoryPage(){const inventory=await getInventory().catch(()=>[]);return <PageFrame title="موجودی" description="تعداد قابل فروش و آستانه هشدار هر تنوع را مدیریت کنید."><InventoryEditor initial={inventory}/></PageFrame>}

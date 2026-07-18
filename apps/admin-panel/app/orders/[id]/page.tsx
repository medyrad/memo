import { notFound } from "next/navigation";
import { OrderStatusEditor } from "../../../components/order-status-editor";
import { PageFrame } from "../../../components/page-frame";
import { getOrder } from "../../../lib/server-api";
export default async function OrderDetailPage({params}:{params:{id:string}}){const order=await getOrder(params.id).catch(()=>null);if(!order)notFound();return <PageFrame title={`سفارش ${order.id.slice(0,8)}`}><OrderStatusEditor initial={order}/></PageFrame>}

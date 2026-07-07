import { PageFrame } from "../../../components/page-frame";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <PageFrame title={`جزئیات سفارش ${params.id}`}><div className="panel">تغییر وضعیت، پرداخت، ارسال و تاریخچه سفارش اینجا مدیریت می‌شود.</div></PageFrame>;
}


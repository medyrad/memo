import { PageFrame } from "../../../components/page-frame";

export default function ProductEditPage({ params }: { params: { id: string } }) {
  return <PageFrame title={`ویرایش محصول ${params.id}`}><div className="panel">اطلاعات محصول از API خوانده و ویرایش می‌شود.</div></PageFrame>;
}


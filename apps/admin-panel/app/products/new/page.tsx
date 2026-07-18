import { PageFrame } from "../../../components/page-frame";
import { ProductCreateForm } from "../../../components/product-create-form";
import { getCategories } from "../../../lib/server-api";
export default async function NewProductPage(){const categories=await getCategories().catch(()=>[]);return <PageFrame title="محصول جدید"><ProductCreateForm categories={categories}/></PageFrame>}

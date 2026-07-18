import { notFound } from "next/navigation";
import { PageFrame } from "../../../components/page-frame";
import { ProductEditor } from "../../../components/product-editor";
import { getCategories, getProduct } from "../../../lib/server-api";
export default async function ProductEditPage({params}:{params:{id:string}}){const [product,categories]=await Promise.all([getProduct(params.id).catch(()=>null),getCategories().catch(()=>[])]);if(!product)notFound();return <PageFrame title={`ویرایش ${product.title}`}><ProductEditor initial={product} categories={categories}/></PageFrame>}

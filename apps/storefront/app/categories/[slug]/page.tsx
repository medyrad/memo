import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "../../../components/product-card";
import { getCategories, getProducts } from "../../../lib/api";
import { toCatalogProduct } from "../../../lib/catalog";
import { absoluteUrl, jsonLd } from "../../../lib/seo";

export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{const category=(await getCategories()).find(item=>item.slug===params.slug);if(!category)return {title:"دسته‌بندی پیدا نشد",robots:{index:false,follow:false}};return {title:category.title,description:category.description||`خرید آنلاین ${category.title} از memostyles`,alternates:{canonical:`/categories/${category.slug}`}};}
export default async function CategoryPage({params}:{params:{slug:string}}){
  const category=(await getCategories()).find(item=>item.slug===params.slug);if(!category)notFound();
  const products=(await getProducts(`category__slug=${encodeURIComponent(params.slug)}`)).map(toCatalogProduct);
  const schema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"خانه",item:absoluteUrl("/")},{"@type":"ListItem",position:2,name:category.title,item:absoluteUrl(`/categories/${category.slug}`)}]};
  return <main className="ms-container"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/><div className="ms-breadcrumb">خانه / {category.title}</div><div className="ms-category-toolbar"><div><h1>{category.title}</h1><p className="muted">{category.description}</p><p>{products.length.toLocaleString("fa-IR")} محصول</p></div></div>{products.length?<div className="ms-product-grid">{products.map(product=><ProductCard product={product} key={product.id}/>)}</div>:<div className="ms-catalog-empty"><h2>محصولی در این دسته منتشر نشده است</h2></div>}</main>;
}

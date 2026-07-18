import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "../../lib/api";
export const metadata:Metadata={title:"مجله",description:"راهنمای خرید، نگهداری و استایل اکسسوری",alternates:{canonical:"/blog"}};
export default async function BlogPage(){const posts=await getBlogPosts();return <main className="ms-container ms-section"><h1>مجله memostyles</h1><div className="grid">{posts.map(post=><Link className="panel" href={`/blog/${post.slug}`} key={post.id}><h2>{post.title}</h2><p>{post.excerpt}</p></Link>)}</div>{!posts.length?<div className="ms-catalog-empty"><p>هنوز مقاله‌ای منتشر نشده است.</p></div>:null}</main>}

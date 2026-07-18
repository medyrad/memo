import type { MetadataRoute } from "next";
import { getBlogPosts, getCategories, getProducts } from "../lib/api";
import { absoluteUrl } from "../lib/seo";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([getProducts(), getCategories(), getBlogPosts()]);
  const staticPages = ["/", "/products", "/about", "/contact", "/faq", "/return-policy", "/blog"];
  return [
    ...staticPages.map((path) => ({ url: absoluteUrl(path), changeFrequency: path === "/" ? "daily" as const : "weekly" as const, priority: path === "/" ? 1 : .7 })),
    ...categories.map(category => ({ url: absoluteUrl(`/categories/${category.slug}`), changeFrequency: "daily" as const, priority: .8 })),
    ...products.map(product => ({ url: absoluteUrl(`/products/${product.slug}`), lastModified: product.updated_at ? new Date(product.updated_at) : undefined, changeFrequency: "daily" as const, priority: .9 })),
    ...posts.map(post => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updated_at ? new Date(post.updated_at) : undefined, changeFrequency: "monthly" as const, priority: .6 })),
  ];
}

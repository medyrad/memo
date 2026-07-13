import type { Product } from "./api";
import type { ShowcaseProduct } from "./showcase-data";

export function toCatalogProduct(product: Product): ShowcaseProduct {
  const variant = product.variants?.find(item => item.price) ?? product.variants?.[0];
  const primary = product.images?.find(image => image.is_primary) ?? product.images?.[0];
  return {
    id: product.id, title: product.title, slug: product.slug,
    category: "necklaces", categoryTitle: "محصول",
    price: Number(variant?.price ?? 0), rating: 0, reviewCount: 0,
    material: variant?.material ?? "", color: variant?.color ?? "",
    variantId: variant?.id ?? "", visual: "heart",
    imageUrl: primary?.image, description: product.short_description,
  };
}

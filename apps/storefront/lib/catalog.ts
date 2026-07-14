import type { Product } from "./api";
import type { CatalogProduct } from "./catalog-types";

export function toCatalogProduct(product: Product): CatalogProduct {
  const variant = product.variants?.find(item => item.price) ?? product.variants?.[0];
  const primary = product.images?.find(image => image.is_primary) ?? product.images?.[0];
  return {
    id: product.id, title: product.title, slug: product.slug,
    category: product.category_slug ?? "products",
    categoryTitle: product.category_title ?? "محصول",
    price: Number(variant?.price ?? 0), rating: product.rating ?? 0, reviewCount: product.review_count ?? 0,
    material: variant?.material ?? "", color: variant?.color ?? "",
    variantId: variant?.id ?? "", visual: "heart",
    imageUrl: primary?.image_url || primary?.image || undefined, description: product.short_description,
    compareAtPrice: variant?.compare_at_price ? Number(variant.compare_at_price) : undefined,
    chainLength: variant?.size,
    availableQuantity: variant?.available_quantity ?? 0,
  };
}

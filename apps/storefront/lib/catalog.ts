import type { Product } from "./api";
import type { ShowcaseProduct } from "./showcase-data";

export function toCatalogProduct(product: Product): ShowcaseProduct {
  const variant = product.variants?.find(item => item.price) ?? product.variants?.[0];
  const primary = product.images?.find(image => image.is_primary) ?? product.images?.[0];
  return {
    id: product.id, title: product.title, slug: product.slug,
    category: (["necklaces", "earrings", "bracelets", "bags", "gifts"].includes(product.category_slug ?? "") ? product.category_slug : "gifts") as ShowcaseProduct["category"],
    categoryTitle: product.category_title ?? "محصول",
    price: Number(variant?.price ?? 0), rating: 0, reviewCount: 0,
    material: variant?.material ?? "", color: variant?.color ?? "",
    variantId: variant?.id ?? "", visual: "heart",
    imageUrl: primary?.image, description: product.short_description,
    compareAtPrice: variant?.compare_at_price ? Number(variant.compare_at_price) : undefined,
    chainLength: variant?.size,
    availableQuantity: variant?.available_quantity ?? 0,
  };
}

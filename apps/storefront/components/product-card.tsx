import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import type { ShowcaseProduct } from "../lib/showcase-data";
import { Heart } from "lucide-react";

export function ProductVisual({ visual, className = "", src, alt = "" }: { visual: string; className?: string; src?: string; alt?: string }) {
  const source = src || (visual === "earrings" || visual === "link-earrings"
    ? "/catalog/earrings-pearl-v2.jpg"
    : visual === "bracelet"
      ? "/catalog/bracelet-chain-v2.jpg"
      : "/catalog/necklace-heart-v2.jpg");
  return (
    <div className={`ms-product-visual has-photo ${className} visual-${visual}`}>
      <img src={source} alt={alt} loading="lazy" />
    </div>
  );
}

export function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <article className="ms-product-card">
      <Link href={`/products/${product.slug}`} className="ms-product-link">
        {product.badge ? <span className="ms-badge">{product.badge}</span> : null}
        <button className="ms-heart" type="button" aria-label="افزودن به علاقه‌مندی"><Heart size={19}/></button>
        <ProductVisual visual={product.visual} src={product.imageUrl} alt={product.title} />
        <div className="ms-product-info">
          <h3>{product.title}</h3>
          <p>{product.price.toLocaleString("fa-IR")} تومان</p>
          {product.compareAtPrice ? <del>{product.compareAtPrice.toLocaleString("fa-IR")} تومان</del> : null}
          <div className="ms-rating">★★★★★ <span>({product.reviewCount})</span></div>
        </div>
      </Link>
      <AddToCartButton compact variantId={product.availableQuantity === 0 ? undefined : product.variantId} />
    </article>
  );
}

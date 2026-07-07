import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import type { ShowcaseProduct } from "../lib/showcase-data";

export function ProductVisual({ visual, className = "" }: { visual: string; className?: string }) {
  return (
    <div className={`ms-product-visual ${className} visual-${visual}`}>
      <span />
    </div>
  );
}

export function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <article className="ms-product-card">
      <Link href={`/products/${product.slug}`} className="ms-product-link">
        {product.badge ? <span className="ms-badge">{product.badge}</span> : null}
        <button className="ms-heart" type="button" aria-label="افزودن به علاقه‌مندی">♡</button>
        <ProductVisual visual={product.visual} />
        <div className="ms-product-info">
          <h3>{product.title}</h3>
          <p>{product.price.toLocaleString("fa-IR")} تومان</p>
          {product.compareAtPrice ? <del>{product.compareAtPrice.toLocaleString("fa-IR")} تومان</del> : null}
          <div className="ms-rating">★★★★★ <span>({product.reviewCount})</span></div>
        </div>
      </Link>
      <AddToCartButton compact variantId={product.variantId} />
    </article>
  );
}


"use client";

import { useState } from "react";
import { addCartItem } from "../lib/cart";

export function AddToCartButton({ variantId, compact = false }: { variantId?: string; compact?: boolean }) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (!variantId) {
      setStatus("این محصول هنوز تنوع قابل خرید ندارد.");
      return;
    }
    setIsSubmitting(true);
    setStatus("");
    try {
      await addCartItem(variantId, 1);
      setStatus("محصول به سبد خرید اضافه شد.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "خطای نامشخص رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button className="button" disabled={isSubmitting} onClick={handleClick} type="button">
        {isSubmitting ? "..." : compact ? "کیف خرید" : "افزودن به سبد"}
      </button>
      {status ? <p className="muted">{status}</p> : null}
    </>
  );
}

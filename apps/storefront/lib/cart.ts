const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
import { csrfHeaders } from "./csrf";

export type CartItem = {
  id: string;
  variant: string;
  quantity: number;
  product_title: string;
  product_slug: string;
  sku: string;
  unit_price: string;
  line_total: string;
  image_url: string;
};

export type Cart = {
  id: string;
  items: CartItem[];
  subtotal: string;
};

export async function getCurrentCart(): Promise<Cart | null> {
  const response = await fetch(`${API_BASE_URL}/cart/current/`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json();
}

export async function addCartItem(variantId: string, quantity = 1) {
  const response = await fetch(`${API_BASE_URL}/cart/add_item/`, {
    method: "POST",
    headers: await csrfHeaders(),
    credentials: "include",
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "افزودن به سبد انجام نشد.");
  }
  return data;
}

export async function setCartItemQuantity(itemId: string, quantity: number) {
  const response = await fetch(`${API_BASE_URL}/cart-items/${itemId}/set_quantity/`, {
    method: "POST",
    headers: await csrfHeaders(),
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "به‌روزرسانی تعداد انجام نشد.");
  }
  return data;
}

export async function removeCartItem(itemId: string) {
  const response = await fetch(`${API_BASE_URL}/cart-items/${itemId}/`, {
    method: "DELETE",
    credentials: "include",
    headers: await csrfHeaders(),
  });
  if (!response.ok) {
    throw new Error("حذف آیتم انجام نشد.");
  }
}

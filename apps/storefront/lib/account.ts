import { csrfHeaders } from "./csrf";
import type { Product } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export type User = { id: string; username: string; email?: string; phone?: string; first_name: string; last_name: string };
export type Address = { id: string; title: string; recipient_name: string; phone: string; province: string; city: string; postal_code: string; address_line: string; is_default: boolean };
export type OrderItem = { id: string; product_title: string; sku: string; quantity: number; unit_price: string; line_total: string; variant: string };
export type Order = {
  id: string; status: string; subtotal: string; discount_total: string; shipping_total: string; grand_total: string;
  shipping_method: string; shipping_address: Partial<Address>; created_at: string; customer_note: string;
  items: OrderItem[]; payment?: { id: string; status: string; provider: string; reference_id?: string } | null;
  shipment?: { status: string; carrier: string; tracking_code?: string } | null;
};
export type WishlistItem = { id: string; product: string; product_detail: Product };
export type Wishlist = { id: string; items: WishlistItem[] };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: "include", cache: "no-store", ...init });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (response.status === 401 || response.status === 403) throw new Error("برای مشاهده این بخش وارد حساب کاربری شوید.");
  if (!response.ok) throw new Error(data?.message ?? data?.detail ?? "دریافت اطلاعات انجام نشد.");
  return data as T;
}

const results = <T>(data: T[] | { results: T[] }) => Array.isArray(data) ? data : data.results;

export const getMe = () => request<User>("/users/me/");
export const updateMe = async (input: Partial<User>) => request<User>("/users/me/", { method: "PATCH", headers: await csrfHeaders(), body: JSON.stringify(input) });
export const getAddresses = async () => results(await request<Address[] | { results: Address[] }>("/addresses/"));
export const updateAddress = async (id: string, input: Partial<Address>) => request<Address>(`/addresses/${id}/`, { method: "PATCH", headers: await csrfHeaders(), body: JSON.stringify(input) });
export const deleteAddress = async (id: string) => request<null>(`/addresses/${id}/`, { method: "DELETE", headers: await csrfHeaders() });
export const getOrders = async () => results(await request<Order[] | { results: Order[] }>("/orders/"));
export const getOrder = (id: string) => request<Order>(`/orders/${encodeURIComponent(id)}/`);
export const getWishlist = async () => results(await request<Wishlist[] | { results: Wishlist[] }>("/wishlist/"));
export const removeWishlistItem = async (id: string) => request<null>(`/wishlist-items/${id}/`, { method: "DELETE", headers: await csrfHeaders() });
export async function addWishlistProduct(productId: string) {
  const lists = await getWishlist();
  if (!lists.length) await request<Wishlist>("/wishlist/", { method: "POST", headers: await csrfHeaders(), body: JSON.stringify({}) });
  return request<WishlistItem>("/wishlist-items/", { method: "POST", headers: await csrfHeaders(), body: JSON.stringify({ product: productId }) });
}

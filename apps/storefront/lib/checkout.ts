import { getCurrentCart } from "./cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export type Order = {
  id: string;
  status: string;
  subtotal?: string;
  discount_total?: string;
  shipping_total?: string;
  grand_total: string;
};

export type Payment = {
  id: string;
  status: string;
  amount: string;
  payment_url?: string;
};

export async function createCheckoutOrder(couponCode = ""): Promise<Order> {
  const cart = await getCurrentCart();
  if (!cart?.id || !cart.items.length) {
    throw new Error("سبد خرید خالی است.");
  }

  const response = await fetch(`${API_BASE_URL}/orders/checkout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ cart_id: cart.id, coupon_code: couponCode }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "ثبت سفارش انجام نشد.");
  }
  return data;
}

export async function startPayment(orderId: string): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/payments/start/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ order_id: orderId, provider: "mock" }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "شروع پرداخت انجام نشد.");
  }
  return data;
}

export async function verifyPayment(paymentId: string): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reference_id: `mock-ref-${Date.now()}` }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? "تایید پرداخت انجام نشد.");
  }
  return data;
}

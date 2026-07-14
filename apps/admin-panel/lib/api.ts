export type Product = {
  id: string;
  title: string;
  slug: string;
  status: string;
  short_description: string;
  variants?: Array<{ id: string; sku: string; price: string; is_active: boolean }>;
};

export type ProductPayload = {
  title: string;
  slug: string;
  status: string;
  short_description: string;
  long_description: string;
};

export type Category = {
  id: string;
  title: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
};

export type InventoryItem = {
  id: string;
  variant: string;
  quantity: number;
  low_stock_threshold: number;
  is_low_stock?: boolean;
};

export type Order = {
  id: string;
  status: string;
  grand_total: string;
  created_at?: string;
};

export type Customer = {
  id: string;
  username: string;
  email: string;
  phone?: string;
  is_active: boolean;
};

export type Coupon = {
  id: string;
  code: string;
  discount_type: string;
  value: string;
  is_active: boolean;
};

export type Banner = {
  id: string;
  title: string;
  placement: string;
  is_active: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
};

export type DashboardData = {
  metrics: { total_sales: string; orders: number; customers: number; average_order_value: string };
  sales_series: Array<{ date: string; value: string; orders: number }>;
  category_sales: Array<{ name: string; value: string }>;
  recent_orders: Array<{ id: string; customer: string; total: string; status: string }>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const API_TIMEOUT_MS = 1200;

async function fetchWithTimeout(input: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? data?.detail ?? "درخواست API ناموفق بود.");
  }
  return data as T;
}

export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<Product[] | { results: Product[] }>("/products/", { cache: "no-store" });
  return Array.isArray(data) ? data : data.results;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const { csrfHeaders } = await import("./csrf");
  return apiFetch<Product>("/products/", {
    method: "POST",
    headers: await csrfHeaders(),
    body: JSON.stringify(payload),
  });
}

function unwrapList<T>(data: T[] | { results: T[] }): T[] {
  return Array.isArray(data) ? data : data.results;
}

export async function getCategories(): Promise<Category[]> {
  return unwrapList(await apiFetch<Category[] | { results: Category[] }>("/categories/", { cache: "no-store" }));
}

export async function getInventory(): Promise<InventoryItem[]> {
  return unwrapList(await apiFetch<InventoryItem[] | { results: InventoryItem[] }>("/inventory/", { cache: "no-store" }));
}

export async function getOrders(): Promise<Order[]> {
  return unwrapList(await apiFetch<Order[] | { results: Order[] }>("/orders/", { cache: "no-store" }));
}

export async function getCustomers(): Promise<Customer[]> {
  return unwrapList(await apiFetch<Customer[] | { results: Customer[] }>("/users/", { cache: "no-store" }));
}

export async function getCoupons(): Promise<Coupon[]> {
  return unwrapList(await apiFetch<Coupon[] | { results: Coupon[] }>("/coupons/", { cache: "no-store" }));
}

export async function getBanners(): Promise<Banner[]> {
  return unwrapList(await apiFetch<Banner[] | { results: Banner[] }>("/banners/", { cache: "no-store" }));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return unwrapList(await apiFetch<BlogPost[] | { results: BlogPost[] }>("/blog-posts/", { cache: "no-store" }));
}

export async function getDashboard(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/orders/dashboard/", { cache: "no-store" });
}

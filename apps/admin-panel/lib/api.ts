export type Category = { id: string; title: string; slug: string; is_active: boolean; sort_order: number };
export type ProductVariant = { id: string; product: string; sku: string; color: string; material: string; size: string; price: string; compare_at_price: string | null; is_active: boolean; available_quantity: number };
export type ProductImage = { id: string; product: string; image_url: string; external_url: string; alt_text: string; sort_order: number; is_primary: boolean };
export type Product = {
  id: string; category: string | null; category_title?: string; category_slug?: string; title: string; slug: string;
  status: "draft" | "active" | "archived"; short_description: string; long_description: string;
  seo_title: string; seo_description: string; created_at?: string; updated_at?: string;
  variants: ProductVariant[]; images: ProductImage[];
};
export type ProductPayload = Pick<Product, "title" | "slug" | "status" | "short_description" | "long_description"> & Partial<Pick<Product, "category" | "seo_title" | "seo_description">>;
export type VariantPayload = Omit<ProductVariant, "id" | "available_quantity">;
export type ImagePayload = Omit<ProductImage, "id" | "image_url">;

export type InventoryItem = { id: string; variant: string; quantity: number; reserved_quantity: number; low_stock_threshold: number; is_low_stock?: boolean; available_quantity?: number };
export type OrderItem = { id: string; product_title: string; sku: string; quantity: number; unit_price: string; line_total: string };
export type Order = {
  id: string; user: string; status: string; subtotal: string; discount_total: string; shipping_total: string; grand_total: string;
  shipping_method: string; shipping_address: Record<string, string>; customer_note: string; created_at?: string; items: OrderItem[];
  payment?: { id: string; status: string; provider: string; reference_id: string } | null;
  shipment?: { status: string; carrier: string; tracking_code: string } | null;
};
export type Customer = { id: string; username: string; email: string; phone?: string; is_active: boolean };
export type Coupon = { id: string; code: string; discount_type: string; value: string; is_active: boolean };
export type Banner = { id: string; title: string; subtitle: string; image_url?: string; external_url: string; link_url: string; placement: string; sort_order: number; is_active: boolean };
export type HomepageSection = { id: string; key: string; kind: string; title: string; subtitle: string; image_url?: string; external_url: string; link_text: string; link_url: string; config: Record<string, unknown>; sort_order: number; is_active: boolean };
export type SiteSetting = { id: string; key: string; label: string; value: unknown; is_public: boolean };
export type BlogPost = { id: string; title: string; slug: string; is_published: boolean };
export type DashboardData = {
  metrics: { total_sales: string; orders: number; customers: number; average_order_value: string };
  sales_series: Array<{ date: string; value: string; orders: number }>;
  category_sales: Array<{ name: string; value: string }>;
  recent_orders: Array<{ id: string; customer: string; total: string; status: string }>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const API_TIMEOUT_MS = 10000;

async function fetchWithTimeout(input: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try { return await fetch(input, { ...init, signal: controller.signal }); } finally { clearTimeout(timeout); }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    credentials: "include", ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? data?.detail ?? "درخواست API ناموفق بود.");
  return data as T;
}
function unwrapList<T>(data: T[] | { results: T[] }): T[] { return Array.isArray(data) ? data : data.results; }
async function list<T>(path: string) { return unwrapList(await apiFetch<T[] | { results: T[] }>(path, { cache: "no-store" })); }
async function mutate<T>(path: string, method: "POST" | "PATCH" | "DELETE", payload?: unknown): Promise<T> {
  const { csrfHeaders } = await import("./csrf");
  return apiFetch<T>(path, { method, headers: await csrfHeaders(), body: payload === undefined ? undefined : JSON.stringify(payload) });
}

export const getProducts = () => list<Product>("/products/");
export const getProduct = (id: string) => apiFetch<Product>(`/products/${id}/`, { cache: "no-store" });
export const createProduct = (payload: ProductPayload) => mutate<Product>("/products/", "POST", payload);
export const updateProduct = (id: string, payload: Partial<ProductPayload>) => mutate<Product>(`/products/${id}/`, "PATCH", payload);
export const deleteProduct = (id: string) => mutate<void>(`/products/${id}/`, "DELETE");
export const createVariant = (payload: VariantPayload) => mutate<ProductVariant>("/product-variants/", "POST", payload);
export const updateVariant = (id: string, payload: Partial<VariantPayload>) => mutate<ProductVariant>(`/product-variants/${id}/`, "PATCH", payload);
export const deleteVariant = (id: string) => mutate<void>(`/product-variants/${id}/`, "DELETE");
export const createProductImage = (payload: ImagePayload) => mutate<ProductImage>("/product-images/", "POST", payload);
export const deleteProductImage = (id: string) => mutate<void>(`/product-images/${id}/`, "DELETE");

export const getCategories = () => list<Category>("/categories/");
export const getInventory = () => list<InventoryItem>("/inventory/");
export const createInventory = (payload: Omit<InventoryItem, "id" | "is_low_stock" | "available_quantity">) => mutate<InventoryItem>("/inventory/", "POST", payload);
export const updateInventory = (id: string, payload: Partial<InventoryItem>) => mutate<InventoryItem>(`/inventory/${id}/`, "PATCH", payload);
export const getOrders = () => list<Order>("/orders/");
export const getOrder = (id: string) => apiFetch<Order>(`/orders/${id}/`, { cache: "no-store" });
export const setOrderStatus = (id: string, status: string, note = "") => mutate<Order>(`/orders/${id}/set-status/`, "POST", { status, note });
export const getCustomers = () => list<Customer>("/users/");
export const getCoupons = () => list<Coupon>("/coupons/");

export const getBanners = () => list<Banner>("/banners/");
export const createBanner = (payload: Omit<Banner, "id" | "image_url">) => mutate<Banner>("/banners/", "POST", payload);
export const updateBanner = (id: string, payload: Partial<Banner>) => mutate<Banner>(`/banners/${id}/`, "PATCH", payload);
export const deleteBanner = (id: string) => mutate<void>(`/banners/${id}/`, "DELETE");
export const getHomepageSections = () => list<HomepageSection>("/homepage-sections/");
export const createHomepageSection = (payload: Omit<HomepageSection, "id" | "image_url">) => mutate<HomepageSection>("/homepage-sections/", "POST", payload);
export const updateHomepageSection = (id: string, payload: Partial<HomepageSection>) => mutate<HomepageSection>(`/homepage-sections/${id}/`, "PATCH", payload);
export const deleteHomepageSection = (id: string) => mutate<void>(`/homepage-sections/${id}/`, "DELETE");
export const getSiteSettings = () => list<SiteSetting>("/site-settings/");
export const createSiteSetting = (payload: Omit<SiteSetting, "id">) => mutate<SiteSetting>("/site-settings/", "POST", payload);
export const updateSiteSetting = (id: string, payload: Partial<SiteSetting>) => mutate<SiteSetting>(`/site-settings/${id}/`, "PATCH", payload);

export const getBlogPosts = () => list<BlogPost>("/blog-posts/");
export const getDashboard = () => apiFetch<DashboardData>("/orders/dashboard/", { cache: "no-store" });

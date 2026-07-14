export type Product = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  status: string;
  category_title?: string;
  category_slug?: string;
  variants?: Array<{ id: string; sku: string; price: string; color: string; material: string; size?: string; compare_at_price?: string; available_quantity?: number }>;
  images?: Array<{ id: string; image: string; alt_text: string; is_primary: boolean; sort_order: number }>;
};

export type Banner = { id: string; title: string; subtitle: string; image: string | null; link_url: string; placement: string; sort_order: number };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const API_TIMEOUT_MS = 5000;

async function fetchWithTimeout(input: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getProducts(query = ""): Promise<Product[]> {
  try {
    let url: string | null = `${API_BASE_URL}/products/${query ? `?${query}` : ""}`;
    const products: Product[] = [];
    while (url && products.length < 400) {
      const response = await fetchWithTimeout(url, { next: { revalidate: 60 } });
      if (!response.ok) throw new Error(`Catalog API failed with ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) return data;
      products.push(...(data.results ?? []));
      url = data.next;
    }
    return products;
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts(`slug=${encodeURIComponent(slug)}`);
  return products[0] ?? null;
}

export async function getBanners(placement = "home"): Promise<Banner[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/banners/?placement=${encodeURIComponent(placement)}&is_active=true`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results ?? data;
  } catch { return []; }
}

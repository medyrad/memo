export type Product = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  status: string;
  variants?: Array<{ id: string; sku: string; price: string; color: string; material: string }>;
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

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/products/`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results ?? data;
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

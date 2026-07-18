export type Product = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description?: string;
  seo_title?: string;
  seo_description?: string;
  status: string;
  category_title?: string;
  category_slug?: string;
  variants?: Array<{ id: string; sku: string; price: string; color: string; material: string; size?: string; compare_at_price?: string; available_quantity?: number }>;
  images?: Array<{ id: string; image: string | null; image_url: string; external_url?: string; alt_text: string; is_primary: boolean; sort_order: number }>;
  rating?: number;
  review_count?: number;
  attributes?: Array<{ id: string; name: string; value: string }>;
  updated_at?: string;
};

export type Category = { id: string; title: string; slug: string; description: string; sort_order: number };
export type Banner = { id: string; title: string; subtitle: string; image: string | null; image_url: string; link_url: string; placement: string; sort_order: number };
export type HomepageSection = { id: string; key: string; kind: string; title: string; subtitle: string; image_url: string; link_text: string; link_url: string; config: Record<string, unknown>; sort_order: number };
export type SiteSetting = { id: string; key: string; label: string; value: Record<string, unknown> };
export type Review = { id: string; user: string; product: string; rating: number; title: string; body: string; created_at: string };
export type BlogPost = { id: string; title: string; slug: string; excerpt: string; body: string; cover_image?: string | null; seo_title: string; seo_description: string; published_at?: string | null; updated_at?: string };

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

async function getPublicList<T>(path: string): Promise<T[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : data.results ?? [];
  } catch { return []; }
}

export const getCategories = () => getPublicList<Category>("/categories/?is_active=true");
export const getHomepageSections = () => getPublicList<HomepageSection>("/homepage-sections/?is_active=true");
export const getSiteSettings = () => getPublicList<SiteSetting>("/site-settings/?is_public=true");
export const getReviews = (productId: string) => getPublicList<Review>(`/reviews/?product=${encodeURIComponent(productId)}&status=approved`);
export const getBlogPosts = () => getPublicList<BlogPost>("/blog-posts/?is_published=true");
export async function getBlogPost(slug: string) { return (await getPublicList<BlogPost>(`/blog-posts/?slug=${encodeURIComponent(slug)}&is_published=true`))[0] ?? null; }

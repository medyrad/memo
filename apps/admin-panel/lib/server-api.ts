import "server-only";
import { cookies } from "next/headers";
import type { Banner, BlogPost, Category, Coupon, Customer, DashboardData, HomepageSection, InventoryItem, Order, Product, SiteSetting } from "./api";

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
async function request<T>(path: string): Promise<T> {
  const cookieHeader = cookies().toString();
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store", headers: cookieHeader ? { Cookie: cookieHeader } : undefined });
  if (!response.ok) throw new Error(`Admin API failed with ${response.status}`);
  return response.json();
}
async function get<T>(path: string): Promise<T[]> {
  const data = await request<T[] | { results: T[] }>(path);
  return Array.isArray(data) ? data : data.results;
}
export const getProducts = () => get<Product>("/products/");
export const getProduct = (id: string) => request<Product>(`/products/${id}/`);
export const getCategories = () => get<Category>("/categories/");
export const getInventory = () => get<InventoryItem>("/inventory/");
export const getOrders = () => get<Order>("/orders/");
export const getOrder = (id: string) => request<Order>(`/orders/${id}/`);
export const getCustomers = () => get<Customer>("/users/");
export const getCoupons = () => get<Coupon>("/coupons/");
export const getBanners = () => get<Banner>("/banners/");
export const getHomepageSections = () => get<HomepageSection>("/homepage-sections/");
export const getSiteSettings = () => get<SiteSetting>("/site-settings/");
export const getBlogPosts = () => get<BlogPost>("/blog-posts/");
export const getDashboard = () => request<DashboardData>("/orders/dashboard/");

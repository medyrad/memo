import "server-only";

import { cookies } from "next/headers";
import type { Banner, BlogPost, Category, Coupon, Customer, DashboardData, InventoryItem, Order, Product } from "./api";

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

async function get<T>(path: string): Promise<T[]> {
  const cookieHeader = cookies().toString();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  if (!response.ok) throw new Error(`Admin API failed with ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : data.results;
}

export const getProducts = () => get<Product>("/products/");
export const getCategories = () => get<Category>("/categories/");
export const getInventory = () => get<InventoryItem>("/inventory/");
export const getOrders = () => get<Order>("/orders/");
export const getCustomers = () => get<Customer>("/users/");
export const getCoupons = () => get<Coupon>("/coupons/");
export const getBanners = () => get<Banner>("/banners/");
export const getBlogPosts = () => get<BlogPost>("/blog-posts/");

export async function getDashboard(): Promise<DashboardData> {
  const cookieHeader = cookies().toString();
  const response = await fetch(`${API_BASE_URL}/orders/dashboard/`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  if (!response.ok) throw new Error(`Admin API failed with ${response.status}`);
  return response.json();
}

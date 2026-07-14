const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
import { csrfHeaders } from "./csrf";

export async function adminLogin(payload: { username: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/users/login/`, {
    method: "POST",
    headers: await csrfHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? data?.non_field_errors?.[0] ?? "ورود ناموفق بود.");
  }
  if (!data?.is_staff) {
    throw new Error("این حساب دسترسی مدیریت ندارد.");
  }
  return data;
}

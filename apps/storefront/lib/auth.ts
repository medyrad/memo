const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
import { csrfHeaders } from "./csrf";

export type AuthPayload = {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
};

async function postAuth(path: string, payload: AuthPayload) {
  const response = await fetch(`${API_BASE_URL}/users/${path}/`, {
    method: "POST",
    headers: await csrfHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? data?.non_field_errors?.[0] ?? "درخواست با خطا روبه‌رو شد.");
  }
  return data;
}

export function login(payload: AuthPayload) {
  return postAuth("login", payload);
}

export function register(payload: AuthPayload) {
  return postAuth("register", payload);
}

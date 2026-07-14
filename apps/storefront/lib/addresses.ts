import { csrfHeaders } from "./csrf";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export type AddressInput = {
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  postal_code: string;
  address_line: string;
  title?: string;
  is_default?: boolean;
};

export async function createAddress(input: AddressInput): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/addresses/`, {
    method: "POST",
    credentials: "include",
    headers: await csrfHeaders(),
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail ?? "ثبت آدرس انجام نشد.");
  return data;
}

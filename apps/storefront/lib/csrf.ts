const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

let cachedToken = "";

export async function getCsrfToken() {
  if (cachedToken) return cachedToken;
  const response = await fetch(`${API_BASE_URL}/users/csrf/`, { credentials: "include" });
  if (!response.ok) throw new Error("دریافت توکن امنیتی انجام نشد.");
  const data = await response.json();
  cachedToken = data.csrfToken;
  return cachedToken;
}

export async function csrfHeaders() {
  return { "Content-Type": "application/json", "X-CSRFToken": await getCsrfToken() };
}

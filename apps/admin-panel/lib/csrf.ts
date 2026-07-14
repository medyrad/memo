const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

let cachedToken = "";

export async function csrfHeaders() {
  if (!cachedToken) {
    const response = await fetch(`${API_BASE_URL}/users/csrf/`, { credentials: "include" });
    if (!response.ok) throw new Error("دریافت توکن امنیتی انجام نشد.");
    cachedToken = (await response.json()).csrfToken;
  }
  return { "Content-Type": "application/json", "X-CSRFToken": cachedToken };
}

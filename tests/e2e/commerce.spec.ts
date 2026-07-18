import { expect, test, type Page } from "@playwright/test";

async function login(page: Page, username = "e2e-customer", password = "Customer-pass-123") {
  await page.goto("/auth/login");
  await page.getByLabel("شماره موبایل یا ایمیل").fill(username);
  await page.getByLabel("رمز عبور", { exact: true }).fill(password);
  await page.getByRole("button", { name: "ورود به حساب" }).click();
  await expect(page.getByRole("status")).toContainText("موفق");
}

async function reachTestGateway(page: Page, slug: string) {
  await login(page);
  await page.goto(`/products/${slug}`);
  await page.getByRole("button", { name: "افزودن به سبد" }).click();
  await expect(page.getByText("محصول به سبد خرید اضافه شد.")).toBeVisible();
  await page.goto("/checkout");
  await page.getByRole("button", { name: "ادامه و پرداخت" }).click();
  await expect(page).toHaveURL(/localhost:8000\/api\/payments\/.+\/test-gateway/);
}

test("خرید کامل و پرداخت موفق", async ({ page }) => {
  await reachTestGateway(page, "minimal-heart-necklace");
  await page.locator("#pay-success").click();
  await expect(page).toHaveURL(/\/checkout\/success\?payment=/);
  await expect(page.getByText("پرداخت شما با موفقیت انجام شد")).toBeVisible();
});

test("پرداخت ناموفق به سفارش واقعی متصل می‌ماند", async ({ page }) => {
  await reachTestGateway(page, "pearl-drop-necklace");
  await page.locator("#pay-failure").click();
  await expect(page).toHaveURL(/\/checkout\/failure\?payment=/);
  await expect(page.getByText("پرداخت ناموفق بود")).toBeVisible();
});

test("اپراتور سفارش پرداخت‌شده را در پنل مدیریت می‌کند", async ({ page }) => {
  await page.goto("http://localhost:3001/login");
  await page.getByLabel("نام کاربری").fill("e2e-admin");
  await page.getByLabel("رمز عبور").fill("Admin-pass-123");
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page).toHaveURL(/localhost:3001\/dashboard/);
  await page.goto("http://localhost:3001/orders");
  await expect(page.getByRole("table")).toBeVisible();
  await page.getByRole("link", { name: "مدیریت" }).first().click();
  await expect(page.getByText("اقلام سفارش")).toBeVisible();
});

import http from "node:http";
import { randomUUID } from "node:crypto";

const products = [
  {
    id: "p-1",
    title: "گردنبند مینیمال",
    slug: "minimal-necklace",
    short_description: "طراحی سبک و روزمره برای استایل‌های ساده.",
    long_description: "گردنبند مینیمال memostyles با رنگ طلایی و فرم ظریف.",
    status: "active",
    variants: [{ id: "v-1", sku: "N-001", price: "850000", color: "طلایی", material: "استیل", is_active: true }],
  },
  {
    id: "p-2",
    title: "گوشواره مرواریدی",
    slug: "pearl-earrings",
    short_description: "انتخابی لطیف برای مهمانی و هدیه.",
    long_description: "گوشواره مرواریدی با ظاهر کلاسیک و سبک.",
    status: "active",
    variants: [{ id: "v-2", sku: "E-001", price: "620000", color: "سفید", material: "مروارید", is_active: true }],
  },
];

const categories = [
  { id: "c-1", title: "گردنبند", slug: "necklaces", is_active: true, sort_order: 1 },
  { id: "c-2", title: "گوشواره", slug: "earrings", is_active: true, sort_order: 2 },
  { id: "c-3", title: "دستبند", slug: "bracelets", is_active: true, sort_order: 3 },
  { id: "c-4", title: "کیف", slug: "bags", is_active: true, sort_order: 4 },
];

const inventory = [
  { id: "i-1", variant: "v-1", quantity: 12, low_stock_threshold: 3, is_low_stock: false },
  { id: "i-2", variant: "v-2", quantity: 2, low_stock_threshold: 3, is_low_stock: true },
];

const orders = [
  { id: "o-1001", status: "pending_payment", grand_total: "1470000", created_at: new Date().toISOString() },
  { id: "o-1000", status: "paid", grand_total: "850000", created_at: new Date().toISOString() },
];

const payments = [];
const shipments = [];
const notifications = [];

const users = [
  { id: "u-1", username: "memo", email: "memo@example.com", phone: "09120000000", is_active: true },
  { id: "u-2", username: "customer", email: "customer@example.com", phone: "09350000000", is_active: true },
];

const coupons = [
  { id: "cp-1", code: "MEMO10", discount_type: "percent", value: "10", is_active: true },
];

const banners = [
  { id: "bn-1", title: "کالکشن شروع تابستان", placement: "home", is_active: true },
];

const blogPosts = [
  { id: "bp-1", title: "چطور اکسسوری مینیمال را ست کنیم؟", slug: "how-to-style-minimal-accessories", is_published: true },
];

let cart = { id: "cart-1", items: [] };

function send(response, status, body) {
  response.writeHead(status, {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Origin": response.allowedOrigin ?? "http://localhost:3000",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function cartResponse() {
  const items = cart.items.map((item) => {
    const product = products.find((candidate) => candidate.variants.some((variant) => variant.id === item.variant));
    const variant = product?.variants.find((candidate) => candidate.id === item.variant);
    const unitPrice = Number(variant?.price ?? 0);
    return {
      ...item,
      product_title: product?.title ?? "محصول",
      product_slug: product?.slug ?? "product",
      sku: variant?.sku ?? "",
      unit_price: String(unitPrice),
      line_total: String(unitPrice * item.quantity),
    };
  });
  const subtotal = items.reduce((sum, item) => sum + Number(item.line_total), 0);
  return { ...cart, items, subtotal: String(subtotal) };
}

function calculateDiscount(subtotal, couponCode) {
  if (!couponCode) return 0;
  const coupon = coupons.find((candidate) => candidate.code.toLowerCase() === couponCode.toLowerCase() && candidate.is_active);
  if (!coupon) {
    const error = new Error("کد تخفیف معتبر نیست.");
    error.status = 400;
    throw error;
  }
  if (coupon.discount_type === "percent") {
    return Math.min(subtotal, Math.round((subtotal * Number(coupon.value)) / 100));
  }
  return Math.min(subtotal, Number(coupon.value));
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost:8000");
  response.allowedOrigin = ["http://localhost:3000", "http://localhost:3001"].includes(request.headers.origin)
    ? request.headers.origin
    : "http://localhost:3000";

  if (request.method === "OPTIONS") {
    return send(response, 204, {});
  }

  if (request.method === "GET" && url.pathname === "/api/products/") {
    return send(response, 200, { count: products.length, next: null, previous: null, results: products });
  }

  const listEndpoints = {
    "/api/categories/": categories,
    "/api/inventory/": inventory,
    "/api/orders/": orders,
    "/api/users/": users,
    "/api/coupons/": coupons,
    "/api/banners/": banners,
    "/api/blog-posts/": blogPosts,
  };

  if (request.method === "GET" && listEndpoints[url.pathname]) {
    const results = listEndpoints[url.pathname];
    return send(response, 200, { count: results.length, next: null, previous: null, results });
  }

  if (request.method === "POST" && url.pathname === "/api/products/") {
    const body = await readBody(request);
    const product = {
      id: randomUUID(),
      title: body.title || "محصول جدید",
      slug: body.slug || `product-${products.length + 1}`,
      short_description: body.short_description || "",
      long_description: body.long_description || "",
      status: body.status || "draft",
      variants: [],
    };
    products.unshift(product);
    return send(response, 201, product);
  }

  if (request.method === "GET" && url.pathname === "/api/cart/current/") {
    return send(response, 200, cartResponse());
  }

  if (request.method === "POST" && url.pathname === "/api/cart/add_item/") {
    const body = await readBody(request);
    const existing = cart.items.find((item) => item.variant === body.variant_id);
    if (existing) {
      existing.quantity += Number(body.quantity ?? 1);
      return send(response, 200, existing);
    }
    const item = { id: randomUUID(), cart: cart.id, variant: body.variant_id, quantity: Number(body.quantity ?? 1) };
    cart.items.push(item);
    return send(response, 201, item);
  }

  const quantityMatch = url.pathname.match(/^\/api\/cart-items\/([^/]+)\/set_quantity\/$/);
  if (request.method === "POST" && quantityMatch) {
    const body = await readBody(request);
    const item = cart.items.find((candidate) => candidate.id === quantityMatch[1]);
    if (!item) return send(response, 404, { message: "آیتم پیدا نشد." });
    item.quantity = Number(body.quantity ?? 1);
    return send(response, 200, item);
  }

  const deleteMatch = url.pathname.match(/^\/api\/cart-items\/([^/]+)\/$/);
  if (request.method === "DELETE" && deleteMatch) {
    cart.items = cart.items.filter((item) => item.id !== deleteMatch[1]);
    return send(response, 204, {});
  }

  if (request.method === "POST" && url.pathname === "/api/orders/checkout/") {
    const currentCart = cartResponse();
    if (!currentCart.items.length) return send(response, 400, { message: "سبد خرید خالی است." });
    const body = await readBody(request);
    let discountTotal = 0;
    try {
      discountTotal = calculateDiscount(Number(currentCart.subtotal), body.coupon_code);
    } catch (error) {
      return send(response, error.status ?? 400, { message: error.message });
    }
    const order = {
      id: randomUUID(),
      status: "pending_payment",
      subtotal: currentCart.subtotal,
      discount_total: String(discountTotal),
      shipping_total: "0",
      grand_total: String(Number(currentCart.subtotal) - discountTotal),
      created_at: new Date().toISOString(),
    };
    orders.unshift(order);
    return send(response, 201, order);
  }

  if (request.method === "POST" && url.pathname === "/api/payments/start/") {
    const body = await readBody(request);
    const order = orders.find((candidate) => candidate.id === body.order_id);
    if (!order) return send(response, 404, { message: "سفارش پیدا نشد." });
    const payment = {
      id: randomUUID(),
      order: order.id,
      provider: body.provider || "mock",
      status: "pending",
      amount: order.grand_total,
      authority: `mock-${order.id}`,
      payment_url: `/checkout?payment=${order.id}`,
    };
    payments.unshift(payment);
    return send(response, 201, payment);
  }

  const verifyPaymentMatch = url.pathname.match(/^\/api\/payments\/([^/]+)\/verify\/$/);
  if (request.method === "POST" && verifyPaymentMatch) {
    const payment = payments.find((candidate) => candidate.id === verifyPaymentMatch[1]);
    if (!payment) return send(response, 404, { message: "پرداخت پیدا نشد." });
    payment.status = "succeeded";
    payment.reference_id = `mock-ref-${Date.now()}`;
    const order = orders.find((candidate) => candidate.id === payment.order);
    if (order) {
      order.status = "paid";
      shipments.unshift({ id: randomUUID(), order: order.id, status: "pending" });
      notifications.unshift({ id: randomUUID(), subject: "سفارش شما ثبت شد", body: `سفارش ${order.id} با موفقیت پرداخت شد.` });
    }
    return send(response, 200, payment);
  }

  if (request.method === "POST" && ["/api/users/login/", "/api/users/register/"].includes(url.pathname)) {
    const body = await readBody(request);
    return send(response, 200, { id: randomUUID(), username: body.username || "memo", email: body.email || "memo@example.com", is_staff: true });
  }

  return send(response, 404, { message: "Not found" });
});

server.listen(8000, () => {
  console.log("Mock API ready on http://localhost:8000");
});

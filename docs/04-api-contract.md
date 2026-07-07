# قرارداد API

## اصول API

- APIها REST هستند.
- مستندات با OpenAPI تولید می‌شود.
- خطاها باید فرمت یکسان داشته باشند.
- endpointهای public و admin جدا شوند.
- permission هر endpoint باید مشخص باشد.
- pagination، filtering و sorting باید استاندارد باشد.

## ماژول‌های اصلی

```text
/api/auth/
/api/users/
/api/categories/
/api/products/
/api/product-variants/
/api/cart/
/api/orders/
/api/payments/
/api/shipments/
/api/coupons/
/api/wishlist/
/api/reviews/
/api/admin/dashboard/
/api/admin/products/
/api/admin/orders/
/api/admin/reports/
```

## قالب مستندسازی هر endpoint

برای هر endpoint این موارد باید ثبت شود:

- Method
- URL
- Auth Required?
- Permission
- Request Body
- Response Body
- Error Codes
- Pagination
- Filtering
- Sorting

## نمونه: لیست محصولات

```http
GET /api/products/
```

Query:

- `category`
- `min_price`
- `max_price`
- `material`
- `color`
- `search`
- `ordering`
- `page`

Response:

```json
{
  "count": 120,
  "next": "https://api.memostyles.example/api/products/?page=2",
  "previous": null,
  "results": []
}
```

## نمونه: جریان سفارش

```text
POST /api/cart/items/
POST /api/orders/checkout/
POST /api/payments/start/
POST /api/payments/verify/
GET  /api/orders/{id}/
```

## فرمت پیشنهادی خطا

```json
{
  "code": "inventory_not_available",
  "message": "موجودی این محصول کافی نیست.",
  "fields": {
    "variant_id": ["این تنوع محصول موجودی کافی ندارد."]
  }
}
```

## کارهای بعدی این سند

- تعریف کامل endpointهای auth.
- تعریف endpointهای محصول و فیلترها.
- تعریف endpointهای cart و checkout.
- تعریف endpointهای admin.
- تعریف permission matrix.


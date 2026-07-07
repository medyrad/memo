# رودمپ فازبه‌فاز

## فاز 0: تعریف محصول

هدف: تبدیل ایده به محدوده دقیق اجرایی.

کارها:

- [x] تعیین پرسونای مشتری
- [x] تعیین دسته‌های محصول
- [x] تعیین قوانین قیمت‌گذاری، تخفیف، ارسال و مرجوعی
- [x] تعیین MVP فروشگاه
- [x] تعیین MVP پنل مدیریت
- [x] تعریف جریان کامل سفارش
- [x] تعریف نیازهای SEO و محتوا

خروجی:

- [x] Scope نهایی MVP
- [x] Business Rules
- [x] User Journey
- [x] Admin Journey

## فاز 1: ERD و طراحی دامنه

هدف: شناخت کامل داده‌ها قبل از کدنویسی.

کارها:

- [x] طراحی موجودیت‌ها
- [x] طراحی رابطه‌ها
- [x] مشخص کردن constraintها
- [x] مشخص کردن enumها و statusها
- [x] مشخص کردن فیلدهای audit مثل `created_at` و `updated_at`

خروجی:

- [x] ERD نسخه 1
- [x] لیست مدل‌های Django
- [ ] لیست migrationهای اولیه

## فاز 2: DDL اولیه

هدف: مستندسازی schema دیتابیس در سطح SQL.

کارها:

- [x] نوشتن DDL برای جدول‌های اصلی
- [x] تعریف primary key و foreign key
- [x] تعریف unique constraintها
- [x] تعریف indexهای اولیه
- [x] تعریف چک‌های مهم دیتابیس

خروجی:

- [x] DDL اولیه PostgreSQL
- [ ] چک‌لیست migrationها

## فاز 3: راه‌اندازی ریپو و زیرساخت محلی

هدف: آماده‌سازی پایه توسعه.

کارها:

- [x] ساختار monorepo
- [x] Docker Compose محلی
- [x] PostgreSQL
- [x] Redis
- [x] Django backend
- [x] Next.js storefront
- [x] Next.js admin panel
- [x] تنظیم lint و format
- [x] تنظیم env sample

خروجی:

- [ ] پروژه قابل اجرا در محیط local
- [x] README راه‌اندازی

## فاز 4: بک‌اند Core

ترتیب پیشنهادی:

1. [x] User, Auth, Role, Permission
2. [x] Category, Product, ProductVariant, ProductImage
3. [x] Inventory
4. [x] Cart
5. [x] Order و OrderItem
6. [x] Payment abstraction
7. [x] Shipment
8. [x] Coupon و DiscountRule
9. [x] Wishlist
10. [x] Review
11. [x] Blog, Page, Banner
12. [x] AuditLog
13. [x] Admin APIs
14. [x] OpenAPI Documentation
15. [x] Tests

خروجی:

- [x] APIهای اصلی
- [x] مستند OpenAPI
- [x] تست‌های بک‌اند

## فاز 5: Storefront

صفحات:

- [x] `/`
- [x] `/products`
- [x] `/products/[slug]`
- [x] `/categories/[slug]`
- [x] `/search`
- [x] `/cart`
- [x] `/checkout`
- [x] `/auth/login`
- [x] `/auth/register`
- [x] `/profile`
- [x] `/profile/orders`
- [x] `/profile/addresses`
- [x] `/wishlist`
- [x] `/blog`
- [x] `/blog/[slug]`
- [x] `/about`
- [x] `/contact`
- [x] `/faq`
- [x] `/return-policy`
- [x] `/privacy-policy`

خروجی:

- [ ] فروشگاه قابل استفاده
- [x] SEO پایه
- [x] سبد خرید و checkout متصل به API

## فاز 6: Admin Panel

صفحات:

- [x] `/admin`
- [x] `/admin/login`
- [x] `/admin/dashboard`
- [x] `/admin/products`
- [x] `/admin/products/new`
- [x] `/admin/products/[id]`
- [x] `/admin/categories`
- [x] `/admin/orders`
- [x] `/admin/orders/[id]`
- [x] `/admin/customers`
- [x] `/admin/inventory`
- [x] `/admin/coupons`
- [x] `/admin/banners`
- [x] `/admin/blog`
- [x] `/admin/reports`
- [x] `/admin/settings`
- [x] `/admin/users`
- [x] `/admin/roles`
- [x] `/admin/audit-logs`

خروجی:

- [x] پنل مدیریت MVP متصل به API
- [x] دسترسی نقش‌محور
- [x] مدیریت سفارش و موجودی

## فاز 7: پرداخت، ارسال و عملیات سفارش

جریان سفارش:

```text
Cart
→ Validate inventory
→ Apply coupon
→ Select address
→ Select shipping method
→ Create pending order
→ Redirect to payment
→ Verify payment
→ Mark order as paid
→ Reduce inventory
→ Create shipment
→ Send notification
```

قانون مهم: موجودی فقط بعد از verify موفق پرداخت کم می‌شود، مگر اینکه سیستم رزرو موجودی با timeout طراحی شود.

وضعیت فعلی:

- [x] validate موجودی قبل از سفارش
- [x] اعمال کوپن در checkout
- [x] ساخت سفارش pending
- [x] start payment با provider mock
- [x] verify پرداخت سمت سرور
- [x] paid کردن سفارش بعد از پرداخت موفق
- [x] کاهش موجودی بعد از پرداخت موفق در backend واقعی
- [x] ساخت shipment اولیه بعد از پرداخت موفق
- [x] ثبت notification سفارش بعد از پرداخت موفق
- [ ] اتصال درگاه پرداخت واقعی

## فاز 8: تست و QA

حداقل تست‌ها:

- Backend Unit Tests
- Backend API Tests
- Permission Tests
- Order Flow Tests
- Payment Verification Tests
- Inventory Tests
- Frontend Component Tests
- E2E Tests با Playwright
- Admin Permission Tests

سناریوهای حیاتی:

- افزودن محصول به سبد خرید
- ثبت سفارش با کوپن
- پرداخت ناموفق
- پرداخت موفق
- اتمام موجودی
- تغییر وضعیت سفارش توسط ادمین
- غیرفعال شدن محصول
- جلوگیری از ورود کاربر بدون دسترسی به پنل مدیریت

## فاز 9: Staging و Production

کارها:

- [ ] Docker production
- [x] Nginx
- [ ] Gunicorn یا Uvicorn
- [ ] PostgreSQL production
- [x] Redis
- [ ] Celery worker
- [ ] Celery beat
- [ ] Object storage
- [ ] Backup
- [ ] Monitoring
- [ ] Error tracking
- [ ] CI/CD
- [ ] Staging deploy
- [ ] Production deploy

## برنامه زمانی پیشنهادی MVP

- هفته 1: تحلیل، Scope، ERD، DDL اولیه، معماری
- هفته 2: راه‌اندازی repo، Docker، Django، PostgreSQL، Auth، Role/Permission
- هفته 3: Catalog، Product، Variant، Image، Inventory
- هفته 4: Cart، checkout draft، Order، Coupon
- هفته 5: Payment، Shipment، Order Status، Notification
- هفته 6: Storefront صفحات اصلی
- هفته 7: Admin panel بخش‌های اصلی
- هفته 8: SEO، Blog، Policies، Wishlist، Review
- هفته 9: Testing، Security، Staging deploy
- هفته 10: Production deploy، Monitoring، Launch checklist

# چک‌لیست پروداکشن

## Backend

- [ ] `DEBUG=False`
- [ ] `SECRET_KEY` فقط در env
- [ ] `ALLOWED_HOSTS` تنظیم شده
- [ ] CORS درست تنظیم شده
- [ ] CSRF درست تنظیم شده
- [ ] secure cookies فعال
- [ ] rate limiting برای APIهای حساس
- [ ] لاگ ساختاریافته
- [ ] backup روزانه دیتابیس
- [ ] migrationها روی staging تست شده‌اند
- [ ] health check endpoint وجود دارد

## Frontend

- [ ] metadata صفحات اصلی
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] canonical URL
- [ ] image optimization
- [ ] خطاهای 404 و 500 طراحی شده‌اند
- [ ] responsive در موبایل، تبلت و دسکتاپ بررسی شده
- [ ] checkout روی موبایل تست شده

## Infrastructure

- [ ] HTTPS فعال
- [ ] Nginx تنظیم شده
- [ ] PostgreSQL production آماده است
- [ ] Redis آماده است
- [ ] Celery worker فعال است
- [ ] Celery beat فعال است
- [ ] object storage برای media وصل است
- [ ] monitoring فعال است
- [ ] error tracking فعال است
- [ ] access logs نگهداری می‌شود
- [ ] rollback plan نوشته شده

## Security

- [ ] پنل مدیریت پشت auth و permission است
- [ ] دسترسی ادمین‌ها role-based است
- [ ] امکان 2FA برای ادمین بررسی شده
- [ ] فایل‌های env commit نشده‌اند
- [ ] آپلود فایل محدود و اعتبارسنجی می‌شود
- [ ] endpointهای پرداخت idempotent طراحی شده‌اند
- [ ] verification پرداخت سمت سرور انجام می‌شود

## Launch

- [ ] تست ثبت سفارش کامل
- [ ] تست پرداخت موفق
- [ ] تست پرداخت ناموفق
- [ ] تست کوپن
- [ ] تست موجودی ناکافی
- [ ] تست ایمیل یا پیامک سفارش
- [ ] تست پنل مدیریت سفارش
- [ ] backup قبل از لانچ
- [ ] دامنه و DNS نهایی
- [ ] مانیتورینگ هنگام لانچ


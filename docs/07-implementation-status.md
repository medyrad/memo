# وضعیت پیاده‌سازی

این سند نشان می‌دهد کدام بخش‌های TODO اولیه در اسکلت فعلی پروژه پیاده‌سازی شده‌اند.

## انجام شده

- [x] ساختار monorepo: `apps`، `packages`، `infra`، `docs`
- [x] اسکلت Django backend
- [x] تنظیمات local، staging و production برای Django
- [x] مدل‌های اصلی حساب کاربری، نقش، دسترسی و آدرس
- [x] مدل‌های کاتالوگ: دسته‌بندی، محصول، تنوع، تصویر و ویژگی
- [x] مدل موجودی و low stock flag
- [x] مدل سبد خرید و آیتم سبد
- [x] مدل سفارش، آیتم سفارش و تاریخچه وضعیت
- [x] مدل پرداخت و verify پرداخت
- [x] مدل ارسال
- [x] مدل کوپن و قانون تخفیف
- [x] مدل بلاگ، صفحه و بنر
- [x] مدل علاقه‌مندی و نقد محصول
- [x] مدل notification و audit log
- [x] APIهای CRUD اولیه با DRF router
- [x] endpointهای auth برای register، login، logout و me
- [x] permission پایه برای کاتالوگ: خواندن عمومی و تغییر فقط برای staff
- [x] OpenAPI endpoint در `/api/schema/` و Swagger در `/api/docs/`
- [x] جریان حداقلی checkout از روی cart
- [x] جریان حداقلی verify پرداخت و کاهش موجودی
- [x] endpointهای cart/current و cart/add_item
- [x] اسکلت Next.js storefront
- [x] صفحات اصلی فروشگاه، محصول، دسته‌بندی، cart، checkout، auth و صفحات محتوایی
- [x] صفحات search، wishlist، blog، profile/orders و profile/addresses
- [x] sitemap و robots اولیه
- [x] اسکلت Next.js admin panel
- [x] صفحات اصلی مدیریت محصول، سفارش، موجودی، کوپن، محتوا، گزارش، کاربران، نقش‌ها و audit logs
- [x] صفحه login پنل مدیریت
- [x] اتصال فرم‌های login/register فروشگاه به API
- [x] اتصال فرم login پنل مدیریت به API
- [x] اتصال دکمه افزودن به سبد صفحه محصول به API
- [x] اتصال صفحه cart به API برای دریافت سبد، تغییر تعداد و حذف آیتم
- [x] اتصال checkout به API برای ساخت سفارش pending
- [x] اتصال لیست و ساخت محصول در پنل مدیریت به API
- [x] اتصال دسته‌بندی، موجودی، سفارش، مشتری، کوپن، بنر و بلاگ پنل مدیریت به API
- [x] توسعه mock API محلی برای تست صفحات پنل مدیریت بدون Django
- [x] اعمال کد تخفیف در checkout
- [x] start و verify پرداخت mock
- [x] ساخت shipment و notification بعد از پرداخت موفق
- [x] Docker Compose محلی برای PostgreSQL، Redis و backend
- [x] Dockerfile بک‌اند و فرانت
- [x] Nginx config اولیه
- [x] تست smoke بک‌اند برای مدل کاربر و موجودی

## باقی‌مانده برای فازهای بعد

- [ ] نصب موفق dependencyها بعد از پایدار شدن شبکه
- [ ] اجرای `makemigrations` و commit کردن migrationها
- [ ] اجرای `migrate`
- [ ] اجرای `pytest`
- [ ] اجرای `pnpm install`
- [ ] اجرای typecheck و build فرانت‌ها
- [x] پیاده‌سازی auth اولیه، login/register و permission enforcement پایه
- [ ] اتصال عملیات نوشتن admin برای دسته‌بندی، موجودی، سفارش، کوپن، محتوا و کاربران به API
- [ ] اتصال تغییر وضعیت سفارش به API
- [ ] اتصال درگاه پرداخت واقعی
- [ ] اتصال درگاه پرداخت واقعی
- [ ] پیاده‌سازی Celery، notification واقعی و object storage
- [ ] تکمیل CI/CD و production deployment

## مانع فعلی verification

در زمان اجرا، نصب وابستگی‌ها به‌دلیل خطاهای شبکه شکست خورد:

- `pip`: خطای SSL هنگام دانلود پکیج‌ها از PyPI
- `pnpm`: خطای `ECONNRESET` و metadata ناقص از npm registry

بعد از پایدار شدن شبکه، این دستورها باید اجرا شوند:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/backend/requirements.txt
cd apps/backend
python manage.py makemigrations
python manage.py migrate
pytest
```

```bash
pnpm install
pnpm typecheck
pnpm build
```

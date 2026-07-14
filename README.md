# memostyles

فروشگاه اینترنتی اکسسوری زنانه با بک‌اند Django/DRF، فروشگاه Next.js و پنل مدیریت Next.js.

## ساختار

```text
apps/backend       Django + DRF API
apps/storefront    Next.js storefront
apps/admin-panel   Next.js admin panel
packages/ui        shared UI placeholders
packages/types     shared TypeScript types
packages/utils     shared utilities
infra              Docker, Nginx, database and deployment files
docs               product, architecture, ERD, API and production docs
```

## اجرای محلی

ابتدا PostgreSQL را اجرا و فایل محیطی را بسازید. تمام محیط‌های اجرایی پروژه از
PostgreSQL استفاده می‌کنند؛ SQLite فقط در تنظیمات ایزوله‌ی تست فعال است.

```bash
cp .env.example .env
docker compose -f infra/docker/docker-compose.local.yml up -d postgres redis
```

Backend:

```bash
cd apps/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

برای اتصال درگاه زرین‌پال باید `ZARINPAL_MERCHANT_ID` و callback عمومی HTTPS را
در محیط استقرار تنظیم کنید. آزادسازی رزرو سفارش‌های پرداخت‌نشده نیز باید هر دقیقه
توسط scheduler اجرا شود:

```bash
python manage.py release_expired_orders
```

Frontend:

```bash
pnpm install
pnpm dev:storefront
pnpm dev:admin
```

Docker services:

```bash
docker compose -f infra/docker/docker-compose.local.yml up -d
```

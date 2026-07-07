# معماری فنی

## Stack پیشنهادی

Backend:

- Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- drf-spectacular
- django-filter
- pytest و pytest-django

Frontend:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query برای داده‌های client-side
- Zustand برای state سبک مثل UI سبد خرید

Infrastructure:

- Docker
- Docker Compose
- Nginx
- Object Storage برای media
- CI/CD
- Monitoring و Error Tracking

## ساختار پیشنهادی پروژه

```text
memostyles
├── apps
│   ├── storefront
│   ├── admin-panel
│   └── backend
├── packages
│   ├── ui
│   ├── types
│   └── utils
├── infra
│   ├── docker
│   ├── nginx
│   ├── postgres
│   ├── redis
│   └── ci-cd
└── docs
    ├── README.md
    ├── 00-project-brief.md
    ├── 01-roadmap.md
    ├── 02-architecture.md
    ├── 03-data-model-erd-ddl.md
    ├── 04-api-contract.md
    ├── 05-ux-brand.md
    └── 06-production-checklist.md
```

## ساختار Django

```text
backend
├── config
│   ├── settings
│   │   ├── base.py
│   │   ├── local.py
│   │   ├── staging.py
│   │   └── production.py
│   ├── urls.py
│   └── asgi.py
├── apps
│   ├── accounts
│   ├── catalog
│   ├── inventory
│   ├── cart
│   ├── orders
│   ├── payments
│   ├── shipping
│   ├── discounts
│   ├── content
│   ├── reviews
│   ├── notifications
│   └── audit
└── tests
```

## تصمیم‌های معماری اولیه

- دیتابیس اصلی PostgreSQL است.
- API اصلی REST است و با OpenAPI مستند می‌شود.
- Django Admin برای شروع قابل استفاده است، اما پنل مدیریت اختصاصی هدف نهایی است.
- frontend و admin بهتر است app جدا داشته باشند تا مرزبندی deploy، auth و UI واضح بماند.
- فایل‌های migration باید commit شوند و از dev تا production یکسان اجرا شوند.
- media در production نباید روی دیسک موقت سرور وابسته باشد؛ object storage لازم است.


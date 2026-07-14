import Link from "next/link";
import type { ReactNode } from "react";
import { ProductVisual } from "./product-card";
import { AddToCartButton } from "./add-to-cart-button";
import type { CatalogProduct } from "../lib/catalog-types";
import {
  BadgeCheck, Bell, Box, CalendarDays, ChevronLeft, CircleUserRound,
  Clock3, CreditCard, Eye, Gift, Grid2X2, Headphones, Heart, LogOut,
  Mail, MapPin, PackageCheck, Phone, RotateCcw, Search, Send, ShieldCheck,
  ShoppingBag, ShoppingCart, SlidersHorizontal, List, Truck, UserRound, X,
} from "lucide-react";

const iconMap = {
  authentic: BadgeCheck, bag: ShoppingBag, bell: Bell, box: Box,
  calendar: CalendarDays, card: CreditCard, clock: Clock3, eye: Eye,
  gift: Gift, grid: Grid2X2, heart: Heart, logout: LogOut, mail: Mail,
  package: PackageCheck, phone: Phone, pin: MapPin, return: RotateCcw,
  search: Search, send: Send, shield: ShieldCheck, support: Headphones,
  truck: Truck, user: UserRound, profile: CircleUserRound, cart: ShoppingCart,
  filter: SlidersHorizontal, list: List,
} as const;

export function MsIcon({ name, size = 22, strokeWidth = 1.55 }: { name: string; size?: number; strokeWidth?: number }) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? CircleUserRound;
  return <Icon className={`ms-ui-icon icon-${name}`} size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export function Breadcrumbs({ items }: { items: Array<[string, string?]> }) {
  return (
    <div className="ms-breadcrumb">
      <Link href="/">خانه</Link>
      {items.map(([label, href]) => (
        <span key={label}>
          <span>/</span>
          {href ? <Link href={href}>{label}</Link> : <b>{label}</b>}
        </span>
      ))}
    </div>
  );
}

export function PageTitle({ title, text, icon = true }: { title: string; text?: string; icon?: boolean }) {
  return (
    <header className="ms-page-title">
      <h1>{icon ? <span>✦</span> : null}{title}</h1>
      {text ? <p>{text}</p> : null}
    </header>
  );
}

export function SoftCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`ms-soft-card ${className}`}>{children}</section>;
}

export function InfoTile({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <article className="ms-info-tile">
      <MsIcon name={icon} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function TrustBar({ compact = false }: { compact?: boolean }) {
  const items = [
    ["authentic", "ضمانت اصالت کالا", "کالای اورجینال با ضمانت"],
    ["truck", "ارسال سریع", "ارسال به سراسر ایران"],
    ["return", "۷ روز ضمانت بازگشت", "مرجوعی آسان و بدون پرسش"],
    ["gift", "بسته‌بندی هدیه", "بسته‌بندی شیک و رایگان"],
    ["support", "پشتیبانی ۲۴/۷", "همیشه کنار شما هستیم"],
  ];
  return (
    <section className={`ms-trust-row ${compact ? "is-compact" : ""}`}>
      {items.map(([icon, title, text]) => (
        <div key={title}>
          <MsIcon name={icon} />
          <b>{title}</b>
          <span>{text}</span>
        </div>
      ))}
    </section>
  );
}

export function ProfileSidebar({ active, user }: { active: "profile" | "wishlist" | "orders" | "addresses" | "dashboard" | "notifications"; user?: { first_name?: string; last_name?: string; username?: string; phone?: string } | null }) {
  const nav = [
    ["dashboard", "داشبورد", "/profile", "grid"],
    ["profile", "اطلاعات حساب", "/profile", "user"],
    ["orders", "سفارش‌های من", "/profile/orders", "bag"],
    ["addresses", "آدرس‌ها", "/profile/addresses", "pin"],
    ["wishlist", "علاقه‌مندی‌ها", "/wishlist", "heart"],
    ["notifications", "اطلاع‌رسانی", "/profile", "bell"],
  ] as const;
  return (
    <aside className="ms-account-sidebar">
      <div className="ms-profile-avatar"><span /><button aria-label="تغییر تصویر">⌘</button></div>
      <h3>{[user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "حساب کاربری"}</h3>
      <p>{user?.phone || ""}</p>
      <nav>
        {nav.map(([key, label, href, icon]) => (
          <Link className={active === key ? "is-active" : ""} href={href} key={key}>
            <MsIcon name={icon} />
            {label}
          </Link>
        ))}
      </nav>
      <Link className="ms-logout" href="/auth/login"><MsIcon name="logout" />خروج</Link>
    </aside>
  );
}

export function CatalogProductCard({ product, removable = false }: { product: CatalogProduct; removable?: boolean }) {
  return (
    <article className="ms-catalog-card">
      {removable ? <button className="ms-remove" type="button" aria-label="حذف"><X size={17}/></button> : <button className="ms-save" type="button" aria-label="علاقه‌مندی"><Heart size={18}/></button>}
      {product.badge ? <span className="ms-badge">{product.badge}</span> : null}
      <Link href={`/products/${product.slug}`}>
        <ProductVisual visual={product.visual} src={product.imageUrl} alt={product.title} />
        <div className="ms-catalog-info">
          <h3>{product.title}</h3>
          <p>{product.material}</p>
          <strong>{product.price.toLocaleString("fa-IR")} تومان</strong>
          {product.compareAtPrice ? <del>{product.compareAtPrice.toLocaleString("fa-IR")} تومان</del> : null}
          <span className="ms-stars">★★★★★ <small>({product.reviewCount})</small> <em>{(product.availableQuantity ?? 0) > 0 ? `${product.availableQuantity} موجود` : "ناموجود"}</em></span>
        </div>
      </Link>
      <div className="ms-card-actions">
        <AddToCartButton compact variantId={product.availableQuantity === 0 ? undefined : product.variantId} />
        <Link href={`/products/${product.slug}`}>مشاهده محصول <MsIcon name="eye" /></Link>
      </div>
    </article>
  );
}

export function ProductRail({ title, products }: { title: string; products: CatalogProduct[] }) {
  return (
    <section className="ms-product-rail">
      <div className="ms-rail-head">
        <Link href="/products">مشاهده همه</Link>
        <h2>✦ {title}</h2>
      </div>
      <div className="ms-rail-row">
        <button type="button" aria-label="قبلی">‹</button>
        {products.map((product) => (
          <Link href={`/products/${product.slug}`} className="ms-rail-item" key={product.id}>
            <ProductVisual visual={product.visual} src={product.imageUrl} alt={product.title} />
            <b>{product.title}</b>
            <span>{product.price.toLocaleString("fa-IR")} تومان</span>
            <em>★★★★★ ({product.reviewCount})</em>
          </Link>
        ))}
        <button type="button" aria-label="بعدی">›</button>
      </div>
    </section>
  );
}

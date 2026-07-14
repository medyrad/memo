import Link from "next/link";
import { MsIcon } from "./storefront-page-kit";
import { CartBadge } from "./cart-badge";
import type { Category } from "../lib/api";

const staticNav = [
  ["جدیدترین‌ها", "/products"],
  ["مجله", "/blog"],
  ["درباره ما", "/about"],
  ["تماس با ما", "/contact"],
];

export function StoreHeader({categories,phone}:{categories:Category[];phone?:string}) {
  const nav = [["جدیدترین‌ها", "/products"], ...categories.map(category => [category.title, `/categories/${category.slug}`]), ...staticNav.slice(1)];
  return (
    <header className="ms-header">
      <div className="ms-announcement">
        <span>ارسال رایگان برای سفارش‌های بالای ۷۰۰ هزار تومان</span>
        <MsIcon name="gift" />
      </div>
      <div className="ms-header-main">
        <div className="ms-support-call">
          <MsIcon name="support" />
          <span>پشتیبانی ۲۴/۷ ساعته</span>
          <b>{phone || ""}</b>
        </div>
        <div className="ms-header-actions">
          <CartBadge />
          <Link href="/wishlist" aria-label="علاقه‌مندی"><MsIcon name="heart" /></Link>
          <Link href="/profile" aria-label="حساب کاربری"><MsIcon name="user" /></Link>
          <Link className="ms-login-link" href="/auth/login">ورود / ثبت‌نام</Link>
        </div>
        <Link className="ms-logo" href="/">
          <span>memostyles</span>
          <small>ACCESSORIES</small>
        </Link>
      </div>
      <div className="ms-nav-row">
        <nav className="ms-nav" aria-label="ناوبری فروشگاه">
          {nav.map(([label, href]) => (
            <Link href={href} key={`${label}-${href}`}>{label}</Link>
          ))}
        </nav>
        <Link className="ms-search-trigger" href="/search" aria-label="جستجو"><MsIcon name="search" /></Link>
      </div>
    </header>
  );
}

import Link from "next/link";
import { MsIcon } from "./storefront-page-kit";

const nav = [
  ["جدیدترین‌ها", "/products"],
  ["گردنبند", "/categories/necklaces"],
  ["گوشواره", "/categories/earrings"],
  ["دستبند", "/categories/bracelets"],
  ["کیف", "/categories/bags"],
  ["هدیه", "/categories/gifts"],
  ["کالکشن‌ها", "/products"],
  ["مجله", "/blog"],
  ["درباره ما", "/about"],
  ["تماس با ما", "/contact"],
];

export function StoreHeader() {
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
          <b>۰۲۱-۹۱۰۹۰۹۰۹</b>
        </div>
        <div className="ms-header-actions">
          <Link href="/cart" aria-label="سبد خرید"><MsIcon name="bag" /><b>۲</b></Link>
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

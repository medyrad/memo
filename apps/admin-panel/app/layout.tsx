import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "پنل مدیریت memostyles",
};

const links = [
  ["داشبورد", "/dashboard"],
  ["محصولات", "/products"],
  ["دسته‌بندی‌ها", "/categories"],
  ["سفارش‌ها", "/orders"],
  ["مشتریان", "/customers"],
  ["موجودی", "/inventory"],
  ["کوپن‌ها", "/coupons"],
  ["بنرها", "/banners"],
  ["بلاگ", "/blog"],
  ["گزارش‌ها", "/reports"],
  ["تنظیمات", "/settings"],
  ["کاربران", "/users"],
  ["نقش‌ها", "/roles"],
  ["لاگ فعالیت", "/audit-logs"],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="admin-shell">
          <aside className="sidebar">
            <Link href="/dashboard" className="brand">memostyles</Link>
            <nav className="nav">
              {links.map(([label, href]) => (
                <Link href={href} key={href}>{label}</Link>
              ))}
            </nav>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}


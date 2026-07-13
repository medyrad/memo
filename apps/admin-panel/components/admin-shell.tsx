"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, Bell, Boxes, CalendarDays, ChevronDown, Crown, FileText, FolderTree, Headphones, Home, Images, Mail, Menu, Plus, Percent, Search, Settings, ShieldCheck, ShoppingBag, ShoppingCart, UsersRound, X } from "lucide-react";

const navigation = [
  [Home, "داشبورد", "/dashboard"], [ShoppingBag, "محصولات", "/products"],
  [FolderTree, "دسته‌بندی‌ها", "/categories"], [ShoppingCart, "سفارش‌ها", "/orders"],
  [UsersRound, "مشتریان", "/customers"], [Percent, "تخفیف‌ها", "/coupons"],
  [Boxes, "موجودی", "/inventory"], [Images, "بنرها", "/banners"],
  [FileText, "بلاگ / مجله", "/blog"], [Settings, "تنظیمات", "/settings"],
  [ShieldCheck, "نقش‌ها و دسترسی‌ها", "/roles"], [BarChart3, "گزارش‌ها", "/reports"],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isLogin = pathname === "/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="admin-shell">
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="نمایش منو">{open?<X/>:<Menu/>}</button>
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="بستن منو" />}
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <Link href="/dashboard" className="brand" onClick={() => setOpen(false)}>
          <Crown className="brand-crown" />
          <span>memostyles</span>
        </Link>
        <nav className="nav" aria-label="منوی اصلی مدیریت">
          {navigation.map(([Icon, label, href]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link className={active ? "active" : ""} href={href} key={href} onClick={() => setOpen(false)}>
                <Icon className="nav-icon" aria-hidden="true"/><span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="support-card"><Headphones className="support-icon"/><div><strong>پشتیبانی فروشگاه</strong><small>نیاز به کمک دارید؟</small></div></div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="top-actions">
            <button className="quick-action"><Plus size={18}/> اقدام سریع <ChevronDown size={16}/></button>
            <button className="date-range"><CalendarDays size={18}/><span>۱۴۰۴/۰۲/۰۱ ـ ۱۴۰۴/۰۲/۰۷</span><ChevronDown size={16}/></button>
          </div>
          <label className="global-search"><Search/><input aria-label="جستجوی سراسری" placeholder="جستجو در سفارش‌ها، محصولات، مشتریان و ..." /></label>
          <div className="account-actions">
            <button className="notification" aria-label="پیام‌ها"><Mail/><b>۳</b></button>
            <button className="notification" aria-label="اعلان‌ها"><Bell/><b>۸</b></button>
            <button className="profile"><span className="avatar">م</span><span>مدیر سیستم</span><ChevronDown size={16}/></button>
          </div>
        </header>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}

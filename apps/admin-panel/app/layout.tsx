import "./globals.css";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AdminShell } from "../components/admin-shell";

const vazirmatn = Vazirmatn({ subsets: ["arabic"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "پنل مدیریت memostyles", template: "%s | memostyles" },
  description: "پنل یکپارچه مدیریت فروشگاه memostyles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}

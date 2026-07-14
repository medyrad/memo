import "./globals.css";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { StoreFooter } from "../components/store-footer";
import { StoreHeader } from "../components/store-header";
import { getCategories, getSiteSettings } from "../lib/api";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "memostyles | اکسسوری زنانه",
  description: "فروشگاه تخصصی اکسسوری زنانه، گردنبند، گوشواره، دستبند و کیف.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);
  const contact = settings.find(setting => setting.key === "contact")?.value;
  const footer = settings.find(setting => setting.key === "footer")?.value;
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <div className="site-shell">
          <StoreHeader categories={categories} phone={String(contact?.phone ?? "")} />
          {children}
          <StoreFooter contact={contact} footer={footer} />
        </div>
      </body>
    </html>
  );
}

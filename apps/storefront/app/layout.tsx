import "./globals.css";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { StoreFooter } from "../components/store-footer";
import { StoreHeader } from "../components/store-header";
import { getCategories, getSiteSettings } from "../lib/api";
import { SITE_URL } from "../lib/seo";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const seo = settings.find(setting => setting.key === "seo")?.value ?? {};
  const title = String(seo.title ?? "memostyles | اکسسوری زنانه");
  const description = String(seo.description ?? "فروشگاه تخصصی گردنبند، دستبند، ست هدیه و کیف با ارسال به سراسر ایران.");
  return {
    metadataBase: new URL(SITE_URL), title: { default: title, template: "%s | memostyles" }, description,
    openGraph: { type: "website", locale: "fa_IR", siteName: "memostyles", title, description, url: SITE_URL },
    twitter: { card: "summary_large_image", title, description },
  };
}

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

import "./globals.css";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { StoreFooter } from "../components/store-footer";
import { StoreHeader } from "../components/store-header";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "memostyles | اکسسوری زنانه",
  description: "فروشگاه تخصصی اکسسوری زنانه، گردنبند، گوشواره، دستبند و کیف.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <div className="site-shell">
          <StoreHeader />
          {children}
          <StoreFooter />
        </div>
      </body>
    </html>
  );
}

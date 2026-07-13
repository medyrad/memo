import { AuthForm } from "../../../components/auth-form";
import { Breadcrumbs, TrustBar } from "../../../components/storefront-page-kit";
import { Gift, Heart, PackageCheck, ShoppingBag } from "lucide-react";

export const metadata = { title: "ثبت‌نام | memostyles" };

export default function RegisterPage() {
  return <main className="ms-container ms-auth-page"><Breadcrumbs items={[["حساب کاربری", "/profile"], ["ثبت‌نام"]]} /><section className="ms-auth-shell register"><div className="ms-register-art"><div className="ms-register-benefits"><h2>چرا در memostyles ثبت‌نام کنید؟</h2><p><ShoppingBag/> تجربه خرید سریع و آسان</p><p><PackageCheck/> مشاهده وضعیت سفارش‌ها</p><p><Heart/> علاقه‌مندی‌ها و لیست هدایا</p><p><Gift/> دسترسی به تخفیف‌ها و پیشنهادهای ویژه</p></div></div><AuthForm mode="register" /></section><TrustBar /></main>;
}

import { AuthForm } from "../../../components/auth-form";
import { Breadcrumbs, TrustBar } from "../../../components/storefront-page-kit";

export const metadata = { title: "ورود | memostyles" };

export default function LoginPage() {
  return <main className="ms-container ms-auth-page"><Breadcrumbs items={[["حساب کاربری", "/profile"], ["ورود"]]} /><section className="ms-auth-shell login"><div className="ms-auth-art login-art"/><AuthForm mode="login" /></section><TrustBar /></main>;
}

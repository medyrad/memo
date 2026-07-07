import { AuthForm } from "../../../components/auth-form";

export default function RegisterPage() {
  return (
    <main className="section">
      <h2>ثبت‌نام</h2>
      <AuthForm mode="register" />
    </main>
  );
}

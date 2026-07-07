import { AuthForm } from "../../../components/auth-form";

export default function LoginPage() {
  return (
    <main className="section">
      <h2>ورود</h2>
      <AuthForm mode="login" />
    </main>
  );
}

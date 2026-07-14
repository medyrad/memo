"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { adminLogin } from "../lib/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    const formData = new FormData(event.currentTarget);

    try {
      await adminLogin({
        username: String(formData.get("username") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      setStatus("ورود مدیریت موفق بود.");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "خطای نامشخص رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit} style={{ width: "min(420px, 100%)" }}>
      <h1 style={{ marginTop: 0 }}>ورود مدیریت</h1>
      <label htmlFor="username">نام کاربری</label>
      <input id="username" name="username" required style={fieldStyle} />
      <label htmlFor="password">رمز عبور</label>
      <input id="password" name="password" required type="password" style={fieldStyle} />
      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "در حال ورود..." : "ورود"}
      </button>
      {status ? <p>{status}</p> : null}
    </form>
  );
}

const fieldStyle: CSSProperties = {
  display: "block",
  margin: "8px 0 16px",
  padding: 12,
  width: "100%",
};

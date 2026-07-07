"use client";

import { FormEvent, useState } from "react";
import type { CSSProperties } from "react";
import { login, register } from "../lib/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      email: String(formData.get("email") ?? ""),
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
    };

    try {
      if (mode === "register") {
        await register(payload);
        setStatus("حساب شما ساخته شد.");
      } else {
        await login(payload);
        setStatus("با موفقیت وارد شدید.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "خطای نامشخص رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <label htmlFor="username">نام کاربری</label>
      <input id="username" name="username" required style={fieldStyle} />

      {mode === "register" ? (
        <>
          <label htmlFor="email">ایمیل</label>
          <input id="email" name="email" required type="email" style={fieldStyle} />
          <label htmlFor="first_name">نام</label>
          <input id="first_name" name="first_name" style={fieldStyle} />
          <label htmlFor="last_name">نام خانوادگی</label>
          <input id="last_name" name="last_name" style={fieldStyle} />
        </>
      ) : null}

      <label htmlFor="password">رمز عبور</label>
      <input id="password" name="password" required minLength={8} type="password" style={fieldStyle} />

      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "در حال ارسال..." : mode === "register" ? "ثبت‌نام" : "ورود"}
      </button>
      {status ? <p className="muted">{status}</p> : null}
    </form>
  );
}

const fieldStyle: CSSProperties = {
  display: "block",
  margin: "8px 0 16px",
  padding: 12,
  width: "100%",
};

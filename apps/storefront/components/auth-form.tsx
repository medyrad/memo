"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AtSign, ChevronLeft, Eye, EyeOff, LockKeyhole, Mail, Smartphone, UserRound } from "lucide-react";
import { login, register } from "../lib/auth";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsSubmitting(true); setStatus("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      email: String(formData.get("email") ?? ""),
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
    };
    if (isRegister && payload.password !== String(formData.get("password_confirm") ?? "")) {
      setStatus("تکرار رمز عبور با رمز عبور یکسان نیست."); setIsSubmitting(false); return;
    }
    try {
      if (isRegister) { await register(payload); setStatus("حساب شما با موفقیت ساخته شد."); }
      else { await login(payload); setStatus("با موفقیت وارد شدید."); }
    } catch (error) { setStatus(error instanceof Error ? error.message : "خطای نامشخص رخ داد."); }
    finally { setIsSubmitting(false); }
  }

  return (
    <form className="ms-auth-form" onSubmit={handleSubmit}>
      <header><span className="ms-auth-spark">✦</span><h1>{isRegister ? "ثبت‌نام" : "ورود"}</h1><p>{isRegister ? "با ایجاد حساب کاربری، خریدی سریع‌تر و لذت‌بخش‌تر را تجربه کنید." : "خوش آمدید! لطفاً برای ادامه وارد حساب کاربری خود شوید."}</p></header>
      {isRegister ? <div className="ms-auth-two"><AuthField label="نام" name="first_name" placeholder="مثال: سارا" required /><AuthField label="نام خانوادگی" name="last_name" placeholder="مثال: احمدی" required /></div> : null}
      <AuthField icon={isRegister ? <Smartphone /> : <UserRound />} label={isRegister ? "شماره موبایل" : "شماره موبایل یا ایمیل"} name="username" placeholder={isRegister ? "مثال: ۰۹۱۲۳۴۵۶۷۸۹" : "مثال: sara@email.com یا ۰۹۱۲۳۴۵۶۷۸۹"} required />
      {isRegister ? <AuthField icon={<AtSign />} label="ایمیل (اختیاری)" name="email" placeholder="sara@email.com" type="email" /> : null}
      <div className="ms-auth-field"><label htmlFor="password">رمز عبور <b>*</b></label><div><LockKeyhole/><input id="password" minLength={8} name="password" placeholder={isRegister ? "حداقل ۸ کاراکتر با ترکیب حروف و عدد" : "رمز عبور خود را وارد کنید"} required type={showPassword ? "text" : "password"}/><button aria-label="نمایش رمز عبور" onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? <EyeOff/> : <Eye/>}</button></div></div>
      {isRegister ? <AuthField icon={<LockKeyhole />} label="تکرار رمز عبور" name="password_confirm" placeholder="رمز عبور را دوباره وارد کنید" type="password" required /> : <div className="ms-auth-options"><label><input type="checkbox"/> مرا به خاطر بسپار</label><Link href="/contact">رمز عبور را فراموش کرده‌اید؟</Link></div>}
      {isRegister ? <label className="ms-terms"><input required type="checkbox"/> <span><Link href="/privacy-policy">قوانین و شرایط</Link> را می‌پذیرم.</span></label> : null}
      <button className="ms-auth-submit" disabled={isSubmitting} type="submit"><span>{isSubmitting ? "در حال ارسال..." : isRegister ? "ایجاد حساب کاربری" : "ورود به حساب"}</span><ChevronLeft/></button>
      {!isRegister ? <><div className="ms-auth-or"><span>یا</span></div><p className="ms-other-title">با حساب‌های دیگر وارد شوید</p><div className="ms-social-login"><button type="button" aria-label="ورود با ایمیل"><Mail/></button><button type="button" aria-label="ورود با موبایل"><Smartphone/></button><button type="button" aria-label="ورود با حساب کاربری"><UserRound/></button></div></> : <div className="ms-auth-or"><span>یا</span></div>}
      <Link className="ms-auth-switch" href={isRegister ? "/auth/login" : "/auth/register"}>{isRegister ? "قبلاً ثبت‌نام کرده‌اید؟ وارد شوید" : "حساب کاربری ندارید؟ ثبت‌نام کنید"}<ChevronLeft/></Link>
      {status ? <p className="ms-auth-status" role="status">{status}</p> : null}
    </form>
  );
}

function AuthField({ label, name, placeholder, type = "text", required = false, icon }: { label: string; name: string; placeholder: string; type?: string; required?: boolean; icon?: React.ReactNode }) {
  return <div className="ms-auth-field"><label htmlFor={name}>{label} {required ? <b>*</b> : null}</label><div>{icon}<input id={name} name={name} placeholder={placeholder} required={required} type={type}/></div></div>;
}

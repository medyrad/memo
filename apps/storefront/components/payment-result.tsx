"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

type PaymentData = {
  id: string;
  status: string;
  amount: string;
  reference_id?: string;
  failure_reason?: string;
  created_at: string;
  order_detail: {
    id: string;
    status: string;
    grand_total: string;
    shipping_address: { recipient_name?: string; phone?: string; address_line?: string; city?: string };
    items: Array<{ id: string; product_title: string; quantity: number; line_total: string }>;
  };
};

export function PaymentResult({ paymentId, expected }: { paymentId?: string; expected: "success" | "failure" }) {
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paymentId) { setError("شناسه پرداخت در آدرس موجود نیست."); return; }
    fetch(`${API_BASE_URL}/payments/${paymentId}/`, { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.detail ?? "اطلاعات پرداخت دریافت نشد.");
        setPayment(data);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "خطای نامشخص"));
  }, [paymentId]);

  if (error) return <section className="ms-payment-result is-failure"><div className="ms-result-icon"><X/></div><h1>نتیجه پرداخت قابل تایید نیست</h1><p>{error}</p><Link href="/profile/orders">مشاهده سفارش‌ها</Link></section>;
  if (!payment) return <section className="ms-payment-result"><p>در حال دریافت نتیجه قطعی پرداخت…</p></section>;

  const succeeded = payment.status === "succeeded";
  if ((expected === "success") !== succeeded) {
    return <section className="ms-payment-result is-failure"><div className="ms-result-icon"><X/></div><h1>وضعیت پرداخت با این صفحه مطابقت ندارد</h1><p>وضعیت ثبت‌شده: {payment.status}</p></section>;
  }
  const address = payment.order_detail.shipping_address ?? {};
  return (
    <section className={`ms-payment-result ${succeeded ? "is-success" : "is-failure"}`}>
      <div className="ms-result-icon">{succeeded ? <Check/> : <X/>}</div>
      <h1>{succeeded ? "پرداخت شما با موفقیت انجام شد" : "پرداخت ناموفق بود"}</h1>
      <p>{succeeded ? "سفارش شما ثبت شد و برای آماده‌سازی ارسال می‌شود." : payment.failure_reason || "پرداخت توسط درگاه تایید نشد."}</p>
      <div className="ms-result-meta">
        <div><span>شماره سفارش</span><b>{payment.order_detail.id}</b></div>
        <div><span>کد پیگیری پرداخت</span><b>{payment.reference_id || "—"}</b></div>
        <div><span>مبلغ</span><b>{Number(payment.amount).toLocaleString("fa-IR")} تومان</b></div>
        <div><span>گیرنده</span><b>{address.recipient_name || "—"}</b></div>
        <div><span>آدرس</span><b>{[address.city, address.address_line].filter(Boolean).join("، ") || "—"}</b></div>
      </div>
      <div className="ms-result-actions"><Link href="/profile/orders">مشاهده سفارش‌ها</Link><Link className="ms-dark-button" href="/">بازگشت به فروشگاه</Link></div>
    </section>
  );
}

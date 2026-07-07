"use client";

import { FormEvent, useState } from "react";
import type { CSSProperties } from "react";
import { createProduct } from "../lib/api";

export function ProductCreateForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    const formData = new FormData(event.currentTarget);

    try {
      const product = await createProduct({
        title: String(formData.get("title") ?? ""),
        slug: String(formData.get("slug") ?? ""),
        status: String(formData.get("status") ?? "draft"),
        short_description: String(formData.get("short_description") ?? ""),
        long_description: String(formData.get("long_description") ?? ""),
      });
      setStatus(`محصول ${product.title} ساخته شد.`);
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "خطای نامشخص رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <label htmlFor="title">نام محصول</label>
      <input id="title" name="title" required style={fieldStyle} />
      <label htmlFor="slug">اسلاگ</label>
      <input id="slug" name="slug" required style={fieldStyle} />
      <label htmlFor="status">وضعیت</label>
      <select id="status" name="status" style={fieldStyle}>
        <option value="draft">پیش‌نویس</option>
        <option value="active">فعال</option>
        <option value="archived">آرشیو</option>
      </select>
      <label htmlFor="short_description">توضیح کوتاه</label>
      <textarea id="short_description" name="short_description" style={fieldStyle} />
      <label htmlFor="long_description">توضیح کامل</label>
      <textarea id="long_description" name="long_description" style={fieldStyle} />
      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "در حال ذخیره..." : "ذخیره محصول"}
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

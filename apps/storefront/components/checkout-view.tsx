"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CreditCard, MapPin, NotepadText, Truck, UserRound } from "lucide-react";
import { getAddresses, getMe, type Address, type User } from "../lib/account";
import { createAddress } from "../lib/addresses";
import { getCurrentCart, type Cart } from "../lib/cart";
import { createCheckoutOrder, startPayment } from "../lib/checkout";
import { CheckoutStepper, TrustStrip } from "./order-ui";

const toman = (value: string | number) => `${Number(value).toLocaleString("fa-IR")} تومان`;

export function CheckoutView() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [shipping, setShipping] = useState<"standard" | "express">("standard");

  useEffect(() => {
    Promise.all([getMe(), getAddresses(), getCurrentCart()])
      .then(([me, savedAddresses, currentCart]) => {
        setUser(me); setAddresses(savedAddresses); setCart(currentCart);
        setSelectedAddress(savedAddresses.find((address) => address.is_default)?.id ?? savedAddresses[0]?.id ?? "new");
      })
      .catch((reason) => setStatus(reason instanceof Error ? reason.message : "اطلاعات checkout دریافت نشد."))
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsSubmitting(true); setStatus("");
    try {
      const form = new FormData(event.currentTarget);
      let addressId = selectedAddress;
      if (!addressId || addressId === "new") {
        const address = await createAddress({
          recipient_name: String(form.get("recipient_name") ?? "").trim(), phone: String(form.get("phone") ?? ""),
          province: String(form.get("province") ?? ""), city: String(form.get("city") ?? ""), postal_code: String(form.get("postal_code") ?? ""),
          address_line: String(form.get("address_line") ?? ""), title: "آدرس سفارش", is_default: addresses.length === 0,
        });
        addressId = address.id;
      }
      const order = await createCheckoutOrder({ addressId, couponCode: String(form.get("coupon_code") ?? ""), shippingMethod: shipping, customerNote: String(form.get("customer_note") ?? "") });
      const payment = await startPayment(order.id, crypto.randomUUID());
      if (!payment.payment_url) throw new Error("آدرس درگاه پرداخت دریافت نشد.");
      window.location.assign(payment.payment_url);
    } catch (error) { setStatus(error instanceof Error ? error.message : "ثبت سفارش با خطا روبه‌رو شد."); }
    finally { setIsSubmitting(false); }
  }

  if (loading) return <div className="ms-catalog-empty"><p>در حال دریافت اطلاعات حساب و سبد خرید…</p></div>;
  const selected = addresses.find((address) => address.id === selectedAddress);
  const shippingCost = shipping === "express" ? 39000 : 0;
  return <div className="ms-checkout-page">
    <div className="ms-breadcrumb">خانه / سبد خرید / اطلاعات ارسال / پرداخت</div><div className="ms-page-heading"><h1>تکمیل خرید</h1></div><CheckoutStepper active={2}/>
    {!cart?.items.length ? <div className="ms-catalog-empty"><h2>سبد خرید خالی است</h2><Link className="ms-dark-button" href="/products">بازگشت به محصولات</Link></div> : <form className="ms-checkout-layout" onSubmit={handleCheckout}>
      <aside className="ms-order-summary"><div className="ms-summary-title"><h3>خلاصه سفارش</h3><span>{cart.items.length.toLocaleString("fa-IR")} کالا</span></div><div className="ms-summary-lines">{cart.items.map((item) => <div className="ms-summary-line" key={item.id}>{item.image_url ? <img src={item.image_url} alt={item.product_title}/> : null}<div><b>{item.product_title}</b><small>{item.quantity.toLocaleString("fa-IR")} × {toman(item.unit_price)}</small></div></div>)}</div><dl className="ms-totals"><div><dt>جمع کالاها</dt><dd>{toman(cart.subtotal)}</dd></div><div><dt>هزینه ارسال</dt><dd>{shippingCost ? toman(shippingCost) : "رایگان"}</dd></div><div className="is-payable"><dt>مبلغ پیش از تخفیف</dt><dd>{toman(Number(cart.subtotal)+shippingCost)}</dd></div></dl></aside>
      <section className="ms-checkout-form">
        <div className="ms-form-panel"><h2>اطلاعات گیرنده <UserRound size={22}/></h2><div className="ms-field-grid"><label>نام گیرنده<span>*</span><input defaultValue={[user?.first_name,user?.last_name].filter(Boolean).join(" ")} name="recipient_name" required={selectedAddress === "new"}/></label><label>شماره موبایل<span>*</span><input defaultValue={user?.phone ?? ""} inputMode="tel" name="phone" required={selectedAddress === "new"}/></label><label>ایمیل<input defaultValue={user?.email ?? ""} disabled type="email"/></label></div></div>
        <div className="ms-form-panel"><h2>آدرس ارسال <MapPin size={22}/></h2>{addresses.length ? <label>آدرس‌های ذخیره‌شده<select value={selectedAddress} onChange={(event) => setSelectedAddress(event.target.value)}>{addresses.map((address) => <option value={address.id} key={address.id}>{address.title} — {address.city}، {address.address_line}</option>)}<option value="new">ثبت آدرس جدید</option></select></label> : null}{selected ? <p className="muted">گیرنده: {selected.recipient_name} — {selected.province}، {selected.city}، {selected.address_line} — کدپستی {selected.postal_code}</p> : <div className="ms-field-grid"><label>استان<span>*</span><input name="province" required/></label><label>شهر<span>*</span><input name="city" required/></label><label>کد پستی<span>*</span><input inputMode="numeric" name="postal_code" required/></label><label className="is-wide">آدرس کامل<span>*</span><input name="address_line" required/></label></div>}</div>
        <div className="ms-form-panel"><h2>روش ارسال <Truck size={22}/></h2><div className="ms-choice-grid"><label className="ms-choice"><input checked={shipping === "standard"} onChange={() => setShipping("standard")} name="shipping" type="radio"/><b>ارسال عادی</b><small>تحویل ۳ تا ۵ روز کاری</small><em>رایگان</em></label><label className="ms-choice"><input checked={shipping === "express"} onChange={() => setShipping("express")} name="shipping" type="radio"/><b>ارسال سریع</b><small>تحویل ۱ تا ۲ روز کاری</small><em>{toman(39000)}</em></label></div></div>
        <div className="ms-form-panel"><h2>روش پرداخت <CreditCard size={22}/></h2><div className="ms-choice-grid"><label className="ms-choice is-selected"><input defaultChecked name="payment" type="radio"/><b>پرداخت آنلاین</b><small>تأیید امن سمت سرور</small></label></div></div>
        <div className="ms-form-panel"><h2>یادداشت سفارش <NotepadText size={22}/></h2><textarea name="customer_note" placeholder="نکته سفارش…"/><label>کد تخفیف<input name="coupon_code" placeholder="کد معتبر فروشگاه"/></label></div>
        {status ? <p className="ms-form-status">{status}</p> : null}<div className="ms-checkout-actions"><Link href="/cart">بازگشت به سبد خرید</Link><button className="ms-dark-button" disabled={isSubmitting} type="submit">{isSubmitting ? "در حال انتقال به درگاه…" : "ادامه و پرداخت"}</button></div>
      </section>
    </form>}
    <TrustStrip/>
  </div>;
}

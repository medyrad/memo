import { BadgeCheck, Check, Headphones, RotateCcw, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StepperProps = {
  active: 1 | 2 | 3;
  failed?: boolean;
};

export function CheckoutStepper({ active, failed = false }: StepperProps) {
  const steps = ["سبد خرید", "اطلاعات ارسال", "پرداخت"];
  return (
    <div className="ms-stepper" aria-label="مراحل خرید">
      {steps.map((step, index) => {
        const number = index + 1;
        const isDone = number < active || (!failed && number === active && active === 3);
        const isActive = number === active;
        return (
          <div className={`ms-step ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`} key={step}>
            <span>{isDone ? <Check size={16}/> : number.toLocaleString("fa-IR")}</span>
            <b>{step}</b>
          </div>
        );
      })}
    </div>
  );
}

export function TrustStrip({ dense = false }: { dense?: boolean }) {
  const items: Array<[LucideIcon, string, string]> = [
    [BadgeCheck, "ضمانت اصالت کالا", "کالای اورجینال با ضمانت"],
    [RotateCcw, "۷ روز ضمانت بازگشت", "مرجوعی آسان و بدون پرسش"],
    [Truck, "ارسال سریع", "ارسال به سراسر ایران"],
    [Headphones, "پشتیبانی ۲۴/۷", "همیشه کنار شما هستیم"],
  ];
  return (
    <section className={`ms-checkout-trust ${dense ? "is-dense" : ""}`}>
      {items.map(([Icon, title, text]) => (
        <div key={title}>
          <Icon size={24}/>
          <b>{title}</b>
          <small>{text}</small>
        </div>
      ))}
    </section>
  );
}

export function OrderProgress({ active = 2 }: { active?: 1 | 2 | 3 | 4 }) {
  const steps = ["ثبت سفارش", "آماده‌سازی", "ارسال", "تحویل"];
  return (
    <div className="ms-order-progress">
      {steps.map((step, index) => {
        const number = index + 1;
        return (
          <div className={`${number <= active ? "is-active" : ""}`} key={step}>
            <span>{number === 1 && active >= 1 ? <Check size={16}/> : number.toLocaleString("fa-IR")}</span>
            <b>{step}</b>
            <small>{number === active ? "در حال " + step : number < active ? "تکمیل شده" : "در انتظار"}</small>
          </div>
        );
      })}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, InfoTile, MsIcon, PageTitle } from "../../components/storefront-page-kit";

export const metadata = {
  title: "قوانین بازگشت کالا | memostyles",
};

const rules = [
  ["clipboard", "شرایط کلی بازگشت کالا", "کالا باید در همان وضعیت اولیه، استفاده‌نشده، بدون آسیب و همراه با کارت گارانتی و بسته‌بندی اصلی بازگردانده شود."],
  ["shield", "کالاهای معیوب یا آسیب‌دیده", "در صورت دریافت کالای آسیب‌دیده، حداکثر تا ۲۴ ساعت پس از تحویل با پشتیبانی تماس بگیرید و تصاویر محصول را ارسال کنید."],
  ["swap", "کالای اشتباه ارسال شده", "اگر کالای اشتباه دریافت کردید، لطفا تا ۲۴ ساعت پس از دریافت اطلاع دهید تا هماهنگی تعویض انجام شود."],
  ["support", "نحوه ثبت درخواست بازگشت", "از بخش سفارش‌های من یا از طریق تماس با پشتیبانی درخواست خود را ثبت کنید."],
  ["wallet", "زمان بازگشت وجه", "پس از دریافت و بررسی کالا، مبلغ پرداختی طی ۳ تا ۷ روز کاری به همان روش پرداخت بازگردانده می‌شود."],
  ["truck", "هزینه ارسال در بازگشت کالا", "در موارد ایراد یا اشتباه ارسال، هزینه با memostyles است و در سایر موارد با مشتری خواهد بود."],
];

export default function ReturnPolicyPage() {
  return (
    <main className="ms-container ms-static-page">
      <Breadcrumbs items={[["قوانین و مقررات"], ["قوانین بازگشت کالا"]]} />
      <section className="ms-return-hero">
        <Image src="/reference-assets/return-hero.png" alt="بسته‌بندی اکسسوری" width={293} height={158} />
        <PageTitle title="قوانین بازگشت کالا" text="رضایت شما اولویت ماست. اگر به هر دلیل از خرید خود رضایت ندارید، می‌توانید مطابق شرایط زیر درخواست بازگشت ثبت کنید." icon={false} />
      </section>

      <section className="ms-info-grid is-four">
        <InfoTile icon="calendar" title="مهلت بازگشت ۷ روزه" text="۷ روز از زمان دریافت کالا برای ثبت درخواست بازگشت" />
        <InfoTile icon="shield" title="شرایط پذیرش" text="کالا باید در شرایط اولیه، استفاده‌نشده و کامل باشد" />
        <InfoTile icon="close" title="موارد غیرقابل بازگشت" text="کالاهای شخصی‌سازی‌شده، تخفیف‌دار و مصرفی قابل بازگشت نیستند" />
        <InfoTile icon="truck" title="روند ثبت درخواست" text="ثبت درخواست در پنل کاربری یا تماس با پشتیبانی" />
      </section>

      <section className="ms-return-rules">
        {rules.map(([icon, title, text], index) => (
          <details open={index === 0} key={title}>
            <summary><MsIcon name={icon} /><b>{title}</b><span>⌄</span></summary>
            <p>{text}</p>
          </details>
        ))}
      </section>

      <section className="ms-warning-box">
        <MsIcon name="warning" />
        <ul>
          <li>کالاهای شخصی‌سازی‌شده، انتخاب رنگ خاص، کالاهای حراجی و هدیه قابل بازگشت نیستند.</li>
          <li>رعایت بهداشت برای گروه اکسسوری‌های بهداشتی الزامی است.</li>
          <li>لطفا تا زمان تایید نهایی، کالا را از خود جدا نکنید و از ارسال خودسرانه پرهیز کنید.</li>
        </ul>
      </section>

      <section className="ms-return-cta">
        <Image src="/reference-assets/return-cta.png" alt="اکسسوری و پارچه ساتن" fill />
        <div>
          <h2>برای ثبت درخواست بازگشت با ما سوال دارید؟</h2>
          <p>تیم پشتیبانی memostyles در کنار شماست.</p>
        </div>
        <Link className="ms-outline-button" href="/contact">تماس با پشتیبانی <MsIcon name="support" /></Link>
        <Link className="ms-dark-button" href="/profile/orders">ثبت درخواست بازگشت</Link>
      </section>
    </main>
  );
}

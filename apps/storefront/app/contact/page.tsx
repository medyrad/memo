import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, MsIcon, PageTitle } from "../../components/storefront-page-kit";

export const metadata = {
  title: "تماس با ما | memostyles",
};

export default function ContactPage() {
  const contactItems = [
    ["phone", "تلفن پشتیبانی", "۰۲۱-۹۱۰۹۰۹۰۹"],
    ["mail", "ایمیل", "info@memostyles.com"],
    ["pin", "آدرس", "تهران، خیابان ولیعصر، مجتمع تجاری نور، طبقه ۴، واحد ۱۲"],
    ["clock", "ساعات کاری", "شنبه تا چهارشنبه: ۹ تا ۱۹، پنجشنبه: ۹ تا ۱۴"],
  ];

  return (
    <main className="ms-container ms-static-page">
      <Breadcrumbs items={[["تماس با ما"]]} />
      <PageTitle title="تماس با ما" text="ما اینجاییم تا به شما کمک کنیم. سوالی دارید یا به راهنمایی نیاز دارید؟" />

      <section className="ms-contact-layout">
        <aside>
          <section className="ms-contact-card">
            <h2>راه‌های ارتباطی</h2>
            {contactItems.map(([icon, title, text]) => (
              <article key={title}>
                <MsIcon name={icon} />
                <div><b>{title}</b><p>{text}</p></div>
              </article>
            ))}
            <h3>ما را در شبکه‌های اجتماعی دنبال کنید</h3>
            <div className="ms-social-circles"><span>◎</span><span>⌁</span><span>☏</span><span>Ⓟ</span></div>
          </section>
          <section className="ms-contact-card">
            <h2>موقعیت روی نقشه</h2>
            <Image src="/reference-assets/contact-map.png" alt="موقعیت فروشگاه روی نقشه" width={276} height={138} />
            <Link href="#" className="ms-outline-button">مشاهده در نقشه <MsIcon name="pin" /></Link>
          </section>
        </aside>

        <form className="ms-contact-form">
          <h2><MsIcon name="edit" /> فرم تماس با ما</h2>
          <p>لطفا اطلاعات خود را تکمیل کنید تا در سریع‌ترین زمان با شما تماس بگیریم.</p>
          <div className="ms-field-grid">
            <label>نام و نام خانوادگی <span>*</span><input placeholder="نام خود را وارد کنید" /></label>
            <label>شماره موبایل <span>*</span><input placeholder="۰۹۱۲۳۴۵۶۷۸۹" /></label>
            <label className="is-wide">ایمیل <span>*</span><input placeholder="example@email.com" type="email" /></label>
            <label className="is-wide">موضوع <span>*</span><select defaultValue=""><option value="" disabled>موضوع پیام خود را انتخاب کنید</option><option>پیگیری سفارش</option><option>پشتیبانی محصول</option><option>همکاری</option></select></label>
            <label className="is-wide">پیام شما <span>*</span><textarea placeholder="پیام خود را بنویسید..." /></label>
          </div>
          <button className="ms-dark-button" type="button">ارسال پیام <MsIcon name="send" /></button>
          <small><MsIcon name="lock" /> اطلاعات شما محفوظ است و صرفا برای پاسخ‌گویی به پیام شما استفاده خواهد شد.</small>
        </form>
      </section>

      <section className="ms-contact-faq">
        <h2>سوالات متداول پربازدید</h2>
        {[
          ["truck", "چگونه می‌توانم سفارش خود را پیگیری کنم؟"],
          ["return", "شرایط بازگشت و تعویض کالا چیست؟"],
          ["wallet", "چه روش‌هایی برای پرداخت موجود است؟"],
          ["clock", "زمان ارسال سفارش‌ها چقدر است؟"],
        ].map(([icon, title]) => (
          <Link href="/faq" key={title}><MsIcon name={icon} /><span>{title}</span><b>‹</b></Link>
        ))}
      </section>
    </main>
  );
}

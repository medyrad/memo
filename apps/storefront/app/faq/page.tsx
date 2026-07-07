import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, MsIcon, PageTitle } from "../../components/storefront-page-kit";

export const metadata = {
  title: "سوالات متداول | memostyles",
};

const groups = [
  {
    icon: "truck",
    title: "سفارش و ارسال",
    questions: [
      ["سفارش من چند روزه به دستم می‌رسد؟", "سفارش‌های ثبت‌شده در تهران معمولا بین ۲۴ تا ۴۸ ساعت کاری و سفارش‌های شهرستان بین ۳ تا ۵ روز کاری پس از ارسال به دست شما می‌رسند."],
      ["هزینه ارسال سفارش‌ها چقدر است؟", "برای سفارش‌های بالای ۷۰۰ هزار تومان ارسال رایگان است و سایر سفارش‌ها بر اساس مقصد محاسبه می‌شوند."],
      ["چطور می‌توانم وضعیت سفارش خود را پیگیری کنم؟", "از بخش حساب کاربری و سفارش‌های من می‌توانید وضعیت سفارش را مشاهده کنید."],
    ],
  },
  {
    icon: "return",
    title: "مرجوعی و تعویض",
    questions: [
      ["شرایط مرجوعی و تعویض کالا چیست؟", "تا ۷ روز پس از دریافت کالا، در صورت عدم استفاده و حفظ بسته‌بندی اصلی، امکان ثبت درخواست مرجوعی یا تعویض وجود دارد."],
      ["چطور درخواست مرجوعی یا تعویض ثبت کنم؟", "از طریق تماس با پشتیبانی یا بخش سفارش‌های من می‌توانید درخواست خود را ثبت کنید."],
      ["هزینه ارسال برای مرجوعی با چه کسی است؟", "در صورت اشتباه ارسال یا ایراد کالا هزینه با memostyles است؛ در سایر موارد با مشتری خواهد بود."],
    ],
  },
  { icon: "wallet", title: "پرداخت", questions: [["چه روش‌هایی برای پرداخت دارید؟", "پرداخت آنلاین با کارت‌های عضو شتاب و کد تخفیف فعال پشتیبانی می‌شود."]] },
  { icon: "box", title: "موجودی کالا", questions: [["کالاهای ناموجود شارژ می‌شوند؟", "بله، برای محصولات محبوب شارژ مجدد انجام می‌شود و می‌توانید از بخش اطلاع‌رسانی خبر بگیرید."]] },
  { icon: "user", title: "حساب کاربری", questions: [["آیا خرید بدون حساب کاربری ممکن است؟", "برای پیگیری سفارش بهتر است حساب کاربری داشته باشید."]] },
  { icon: "gift", title: "بسته‌بندی هدیه", questions: [["آیا بسته‌بندی هدیه رایگان است؟", "بله، بسته‌بندی شیک برای بیشتر سفارش‌ها رایگان انجام می‌شود."]] },
];

export default function FaqPage() {
  return (
    <main className="ms-container ms-static-page">
      <Breadcrumbs items={[["راهنما و پشتیبانی"], ["سوالات متداول"]]} />
      <PageTitle title="سوالات متداول" text="پاسخ پرسش‌های پرتکرار شما درباره سفارش، ارسال، پرداخت، مرجوعی و خدمات فروشگاه را در این بخش پیدا کنید." icon={false} />
      <form className="ms-faq-search"><input placeholder="جستجو در سوالات متداول..." /><button type="button"><MsIcon name="search" /></button></form>

      <section className="ms-faq-layout">
        <aside>
          <div className="ms-faq-cats">
            <h2>دسته‌بندی موضوعی</h2>
            {groups.map((group, index) => (
              <a href={`#faq-${index}`} key={group.title}><MsIcon name={group.icon} /><span>{group.title}</span><b>{index === 0 ? 12 : index === 1 ? 7 : 6}</b></a>
            ))}
          </div>
          <div className="ms-faq-support">
            <h2>پاسخ خود را پیدا نکردید؟</h2>
            <p>با ما تماس بگیرید. تیم پشتیبانی ما هرروزه از ۹ صبح تا ۶ شب پاسخگوی شماست.</p>
            <Link className="ms-dark-button" href="/contact">تماس با پشتیبانی <MsIcon name="support" /></Link>
            <p>۰۲۱-۹۱۰۹۰۹۰۹</p>
            <p>info@memostyles.com</p>
            <Image src="/reference-assets/faq-jewels.png" alt="اکسسوری‌های ظریف" width={240} height={224} />
          </div>
        </aside>

        <div className="ms-faq-list">
          {groups.map((group, index) => (
            <section className="ms-faq-group" id={`faq-${index}`} key={group.title}>
              <h2><MsIcon name={group.icon} />{group.title}</h2>
              {group.questions.map(([question, answer], qIndex) => (
                <details open={index < 2 && qIndex === 0} key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </section>
          ))}
        </div>
      </section>

      <section className="ms-faq-cta">
        <div className="ms-envelope-art" />
        <h2>سوال دیگری دارید؟</h2>
        <p>اگر پاسخ مورد نظر خود را پیدا نکردید، از طریق راه‌های ارتباطی زیر با ما در تماس باشید.</p>
        <Link className="ms-dark-button" href="/contact">تماس با پشتیبانی</Link>
      </section>
    </main>
  );
}

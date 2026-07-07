import Link from "next/link";
import { Breadcrumbs, MsIcon, PageTitle, ProfileSidebar } from "../../components/storefront-page-kit";

export const metadata = {
  title: "پروفایل کاربر | memostyles",
};

const rows = [
  ["#۱۰۳۴۵۶", "۱۴۰۲/۰۳/۱۵", "۱,۲۹۰,۰۰۰ تومان", "تحویل‌شده", "tone-green"],
  ["#۱۰۲۹۸۷", "۱۴۰۲/۰۳/۰۸", "۷۶۸,۰۰۰ تومان", "در حال آماده‌سازی", "tone-warm"],
  ["#۱۰۲۴۵۱", "۱۴۰۲/۰۲/۲۵", "۴۵۰,۰۰۰ تومان", "لغو شده", "tone-red"],
];

export default function ProfilePage() {
  return (
    <main className="ms-container ms-account-page">
      <Breadcrumbs items={[["حساب کاربری"], ["پروفایل"]]} />
      <PageTitle title="پروفایل کاربر" text="خوش آمدید سارا احمدی، اطلاعات حساب کاربری خود را مدیریت کنید." icon={false} />
      <section className="ms-account-layout">
        <ProfileSidebar active="profile" />
        <div className="ms-account-content">
          <section className="ms-profile-form">
            <h2><MsIcon name="user" /> اطلاعات شخصی</h2>
            <div className="ms-field-grid">
              <label>نام <span>*</span><input defaultValue="سارا" /></label>
              <label>نام خانوادگی <span>*</span><input defaultValue="احمدی" /></label>
              <label>شماره موبایل <span>*</span><input defaultValue="۰۹۱۲۳۴۵۶۷۸۹" /></label>
              <label>ایمیل <span>*</span><input defaultValue="sara@email.com" /></label>
              <label>تاریخ تولد (اختیاری)<input defaultValue="۱۳۷۲/۰۵/۱۲" /></label>
            </div>
            <div className="ms-form-actions"><button className="ms-dark-button" type="button">ذخیره تغییرات</button><Link href="/auth/login">تغییر رمز عبور <MsIcon name="lock" /></Link></div>
          </section>

          <section className="ms-profile-stats">
            {[
              ["bag", "سفارش‌های تکمیل‌شده", "۲۷", "سفارش"],
              ["box", "سفارش‌های در حال پردازش", "۳", "سفارش"],
              ["heart", "علاقه‌مندی‌ها", "۱۸", "محصول"],
              ["diamond", "امتیاز باشگاه مشتریان", "۱,۲۵۰", "امتیاز"],
            ].map(([icon, label, value, unit]) => (
              <article key={label}><MsIcon name={icon} /><span>{label}</span><b>{value}</b><small>{unit}</small></article>
            ))}
          </section>

          <section className="ms-profile-bottom">
            <article className="ms-default-address">
              <h2>آدرس پیش‌فرض <MsIcon name="pin" /></h2>
              <p>تهران، خیابان ولیعصر، بالاتر از میدان مطهری، پلاک ۶۳، واحد ۱۲</p>
              <p>کد پستی: ۱۵۸۷۸۶۵۴۳۲۱</p>
              <p>شماره تماس: ۰۹۱۲۳۴۵۶۷۸۹</p>
              <div><Link className="ms-outline-button" href="/profile/addresses">مدیریت آدرس‌ها</Link><button className="ms-dark-button" type="button">ویرایش آدرس</button></div>
            </article>
            <article className="ms-last-orders">
              <h2>آخرین سفارش‌ها <MsIcon name="bag" /></h2>
              <table>
                <thead><tr><th>شماره سفارش</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
                <tbody>{rows.map(([id, date, price, status, tone]) => <tr key={id}><td>{id}</td><td>{date}</td><td>{price}</td><td><span className={tone}>{status}</span></td></tr>)}</tbody>
              </table>
              <Link className="ms-outline-button" href="/profile/orders">مشاهده همه سفارش‌ها</Link>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}

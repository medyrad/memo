import Link from "next/link";
import { MsIcon, TrustBar } from "./storefront-page-kit";

export function StoreFooter({contact,footer}:{contact?:Record<string,unknown>;footer?:Record<string,unknown>}) {
  const phone=String(contact?.phone??""); const email=String(contact?.email??""); const address=String(contact?.address??"");
  return (
    <footer className="ms-footer">
      <TrustBar compact />
      <section className="ms-newsletter">
        <div className="ms-envelope-art" />
        <div>
          <h3>در اینستاگرام با ما همراه باشید</h3>
          <p>ایمیل خود را وارد کنید تا از تخفیف‌های ویژه و جدیدترین کالکشن‌ها باخبر شوید.</p>
        </div>
        <form>
          <input placeholder="ایمیل خود را وارد کنید" type="email" />
          <button type="button">ثبت نام</button>
        </form>
      </section>
      <section className="ms-footer-grid">
        <div>
          <h3 className="ms-footer-logo">memostyles</h3>
          <p>{String(footer?.description??"")}</p>
          <div className="ms-socials"><span>◎</span><span>⌁</span><span>Ⓟ</span><span>♪</span></div>
        </div>
        <div>
          <h4>راهنمای مشتریان</h4>
          <Link href="/faq">سوالات متداول</Link>
          <Link href="/products">روش‌های خرید</Link>
          <Link href="/return-policy">شرایط و قوانین</Link>
          <Link href="/privacy-policy">حریم خصوصی</Link>
          <Link href="/contact">تماس با ما</Link>
        </div>
        <div>
          <h4>دسترسی سریع</h4>
          <Link href="/products">جدیدترین‌ها</Link>
          <Link href="/categories/necklaces">گردنبند</Link>
          <Link href="/categories/bracelets">دستبند</Link>
          <Link href="/categories/gifts">ست هدیه</Link>
          <Link href="/categories/bags">کیف</Link>
        </div>
        <div>
          <h4>اطلاعات تماس</h4>
          <p><MsIcon name="phone" /> {phone}</p>
          <p><MsIcon name="mail" /> {email}</p>
          <p><MsIcon name="pin" /> {address}</p>
        </div>
      </section>
      <p className="ms-copyright">{String(footer?.copyright??"")}</p>
    </footer>
  );
}

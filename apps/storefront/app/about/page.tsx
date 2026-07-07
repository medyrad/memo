import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, InfoTile, MsIcon, PageTitle, SoftCard } from "../../components/storefront-page-kit";

export const metadata = {
  title: "درباره ما | memostyles",
};

export default function AboutPage() {
  return (
    <main className="ms-container ms-static-page">
      <Breadcrumbs items={[["درباره ما"]]} />
      <PageTitle title="درباره ما" />

      <section className="ms-about-hero">
        <Image src="/reference-assets/about-hero.png" alt="اکسسوری‌های ظریف memostyles" fill priority />
        <div>
          <h2>زیبایی شما، الهام ماست</h2>
          <p>در memostyles باور داریم که اکسسوری فقط یک جزئیات نیست؛ بیانگر شخصیت و داستان شماست.</p>
          <Link className="ms-dark-button" href="/products">مشاهده کالکشن‌ها</Link>
        </div>
      </section>

      <section className="ms-about-story">
        <Image src="/reference-assets/about-jewels.png" alt="گردنبند و گوشواره طلایی" width={436} height={158} />
        <div>
          <h2>✦ داستان ما</h2>
          <p>memostyles از سال ۱۳۹۸ با عشق به زیبایی‌های ساده و ماندگار متولد شد. ما با الهام از مینیمالیسم، ظرافت زنانه و کیفیت بی‌نقص، اکسسوری‌هایی طراحی می‌کنیم که در کنار شما هر روز خاص‌تر بدرخشند.</p>
          <p>هدف ما ساخت محصولاتی است که فراتر از ترندها بمانند و به بخشی از استایل و خاطرات شما تبدیل شوند.</p>
        </div>
      </section>

      <section className="ms-info-grid is-four">
        <InfoTile icon="support" title="پشتیبانی واقعی" text="کنار شما هستیم، قبل و بعد از خرید" />
        <InfoTile icon="gift" title="بسته‌بندی هدیه" text="هر سفارش با ظرافت آماده هدیه دادن" />
        <InfoTile icon="diamond" title="طراحی مینیمال" text="سادگی، ظرافت و ماندگاری در هر قطعه" />
        <InfoTile icon="authentic" title="کیفیت منتخب" text="مواد اولیه ممتاز و کنترل کیفیت دقیق" />
      </section>

      <SoftCard className="ms-values-band">
        <h2>✦ ماموریت و ارزش‌های ما</h2>
        <div>
          {[
            ["customer", "مشتری‌مداری", "تجربه‌ای دلپذیر و خاطره‌انگیز در هر خرید"],
            ["leaf", "پایداری", "تولید مسئولانه و توجه به محیط‌زیست"],
            ["spark", "شفافیت و اعتماد", "رویکرد شفاف در خدمات، قیمت‌گذاری و ارتباط"],
            ["quality", "کیفیت یک سرویس", "استفاده از بهترین متریال‌ها و استانداردهای ساخت"],
          ].map(([icon, title, text]) => (
            <article key={title}><MsIcon name={icon} /><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </SoftCard>

      <section className="ms-about-detail">
        <div className="ms-about-checks">
          <h2>✦ چرا memostyles؟</h2>
          {["طراحی‌های اختصاصی و به‌روز", "توجه به جزئیات در هر مرحله از تولید", "ضمانت کیفیت و رضایت مشتری", "ارسال سریع و بسته‌بندی شکیل"].map((item) => (
            <p key={item}><span>✓</span>{item}</p>
          ))}
          <Link className="ms-outline-button" href="/products">مشاهده کالکشن‌ها</Link>
        </div>
        <Image src="/reference-assets/about-box.png" alt="جعبه هدیه memostyles" width={257} height={190} />
        <div>
          <h2>هنر در جزئیات</h2>
          <p>هر قطعه با دقت و عشق ساخته می‌شود؛ از انتخاب متریال تا پرداخت نهایی، ما به یکپارچگی، کیفیت و درخشش توجه می‌کنیم تا چیزی ماندگار به همراه شما باشد.</p>
          <div className="ms-mini-values">
            <span><MsIcon name="authentic" />استیل ضدحساسیت</span>
            <span><MsIcon name="drop" />آبکاری بادوام</span>
            <span><MsIcon name="diamond" />نگین‌های درخشان</span>
          </div>
        </div>
      </section>

      <SoftCard className="ms-founder-card">
        <Image src="/reference-assets/founder.png" alt="سارا احمدی بنیان‌گذار memostyles" width={127} height={127} />
        <div>
          <h2>پیام بنیان‌گذار</h2>
          <p>هدف من ساخت اکسسوری‌هایی است که زنان با اعتمادبه‌نفس می‌پوشند و هر روز با آن‌ها احساس خاص بودن دارند. از اینکه memostyles را انتخاب می‌کنید، صمیمانه سپاسگزارم.</p>
          <b>سارا احمدی، بنیان‌گذار memostyles</b>
        </div>
        <strong>Thank you</strong>
      </SoftCard>
    </main>
  );
}

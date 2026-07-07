import { AccountSidebar, ProfileOrderRow } from "../../../components/order-ui";
import { profileOrders, toman } from "../../../lib/order-data";

export default function ProfileOrdersPage() {
  return (
    <main className="ms-container">
      <div className="ms-account-page">
        <div className="ms-breadcrumb">خانه / حساب کاربری / سفارش‌های من</div>
        <div className="ms-account-layout">
          <AccountSidebar />
          <section className="ms-account-content">
            <div className="ms-page-heading">
              <h1>سفارش‌های من</h1>
              <p>لیست سفارش‌های ثبت‌شده، وضعیت ارسال و جزئیات هر سفارش را اینجا ببینید.</p>
            </div>
            <div className="ms-order-tools">
              <input placeholder="جستجو با شماره سفارش..." />
              <div>
                {["همه", "در حال آماده‌سازی", "ارسال‌شده", "تحویل‌شده", "لغوشده"].map((item, index) => (
                  <button className={index === 0 ? "is-active" : ""} type="button" key={item}>{item}</button>
                ))}
              </div>
              <select defaultValue="newest"><option value="newest">مرتب‌سازی: جدیدترین</option></select>
            </div>
            <div className="ms-order-stats">
              <div><span>▢</span><b>{profileOrders.length.toLocaleString("fa-IR")}</b><small>کل سفارش‌ها</small></div>
              <div><span>◇</span><b>۳</b><small>در حال انجام</small></div>
              <div><span>▤</span><b>۱۹</b><small>تحویل‌شده</small></div>
              <div><span>◌</span><b>۵</b><small>لغوشده</small></div>
              <div><span>♢</span><b>{toman(15570000)}</b><small>مجموع هزینه‌ها</small></div>
            </div>
            <h2 className="ms-list-title">لیست سفارش‌ها</h2>
            <div className="ms-profile-order-list">
              {profileOrders.map((order, index) => <ProfileOrderRow index={index} key={order.id} />)}
            </div>
            <button className="ms-load-more" type="button">مشاهده سفارش‌های بیشتر⌄</button>
          </section>
        </div>
      </div>
    </main>
  );
}

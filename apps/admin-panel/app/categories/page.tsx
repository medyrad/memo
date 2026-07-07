import { PageFrame } from "../../components/page-frame";
import { getCategories } from "../../lib/api";

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <PageFrame title="دسته‌بندی‌ها">
      <div className="table">
        <div className="row"><strong>عنوان</strong><strong>اسلاگ</strong><strong>وضعیت</strong></div>
        {categories.length ? categories.map((category) => (
          <div className="row" key={category.id}>
            <span>{category.title}</span>
            <span>{category.slug}</span>
            <span>{category.is_active ? "فعال" : "غیرفعال"}</span>
          </div>
        )) : <div className="row"><span>دسته‌بندی ثبت نشده است.</span><span>-</span><span>-</span></div>}
      </div>
    </PageFrame>
  );
}

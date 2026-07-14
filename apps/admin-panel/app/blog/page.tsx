import { PageFrame } from "../../components/page-frame";
import { getBlogPosts } from "../../lib/server-api";

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);

  return (
    <PageFrame title="بلاگ">
      <div className="table">
        <div className="row"><strong>عنوان</strong><strong>اسلاگ</strong><strong>وضعیت</strong></div>
        {posts.length ? posts.map((post) => (
          <div className="row" key={post.id}>
            <span>{post.title}</span>
            <span>{post.slug}</span>
            <span>{post.is_published ? "منتشر شده" : "پیش‌نویس"}</span>
          </div>
        )) : <div className="row"><span>مقاله‌ای ثبت نشده است.</span><span>-</span><span>-</span></div>}
      </div>
    </PageFrame>
  );
}

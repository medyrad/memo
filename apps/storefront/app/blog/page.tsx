import Link from "next/link";

const posts = [
  {
    slug: "how-to-style-minimal-accessories",
    title: "چطور اکسسوری مینیمال را ست کنیم؟",
    excerpt: "راهنمای سریع انتخاب گردنبند، گوشواره و دستبند برای استایل روزمره.",
  },
];

export default function BlogPage() {
  return (
    <main className="section">
      <h2>بلاگ</h2>
      <div className="grid">
        {posts.map((post) => (
          <Link className="product-card" href={`/blog/${post.slug}`} key={post.slug}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}


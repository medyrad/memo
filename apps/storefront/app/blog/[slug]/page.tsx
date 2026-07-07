export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  return (
    <main className="section">
      <h2>مقاله</h2>
      <div className="panel">
        <p>محتوای مقاله `{params.slug}` در فاز اتصال CMS از API خوانده می‌شود.</p>
      </div>
    </main>
  );
}


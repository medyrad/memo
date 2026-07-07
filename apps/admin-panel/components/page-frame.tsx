export function PageFrame({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <div className="page-title">
        <h1>{title}</h1>
        {action}
      </div>
      {children}
    </>
  );
}


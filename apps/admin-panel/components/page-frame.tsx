export function PageFrame({ title, description, eyebrow, action, children }: { title: string; description?: string; eyebrow?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="page-frame">
      <div className="page-heading">
        <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>
        {action && <div className="page-action">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ tone = "success", children }: { tone?: "success" | "warning" | "danger" | "info" | "neutral"; children: React.ReactNode }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="empty-state">{children}</div>;
}

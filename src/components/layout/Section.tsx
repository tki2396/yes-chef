type SectionProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-md border bg-card p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {children ?? <div className="h-36 rounded-md bg-muted/50" />}
    </section>
  );
}

import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
};

export function PageHeader({ kicker, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {kicker ? <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">{kicker}</p> : null}
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {action ? (
        <Button asChild className="w-full sm:w-auto">
          <a href={action.href}>{action.label}</a>
        </Button>
      ) : null}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-md border border-dashed bg-card px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? (
        <Button asChild className="mt-6">
          <a href={action.href}>{action.label}</a>
        </Button>
      ) : null}
    </div>
  );
}

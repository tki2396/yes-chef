import { cn } from "@/lib/utils";
import type { AppRoute } from "./AppShell";

type MobileNavProps = {
  routes: AppRoute[];
};

export function MobileNav({ routes }: MobileNavProps) {
  const pathname = window.location.pathname;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur md:hidden" aria-label="Primary navigation">
      <div className="grid grid-cols-5 gap-1">
        {routes.map(route => {
          const Icon = route.icon;
          const active = pathname === route.path || (route.path !== "/" && pathname.startsWith(route.path));

          return (
            <a
              key={route.path}
              href={route.path}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-colors",
                active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span className="max-w-full truncate">{route.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

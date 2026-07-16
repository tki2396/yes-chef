import { ChefHat } from "lucide-react";
import { appPath, getAppPath } from "@/lib/routing";
import { cn } from "@/lib/utils";
import type { AppRoute } from "./AppShell";

type DesktopSidebarProps = {
  routes: AppRoute[];
};

export function DesktopSidebar({ routes }: DesktopSidebarProps) {
  const pathname = getAppPath(window.location.pathname);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar text-sidebar-foreground md:block">
      <div className="flex h-full flex-col">
        <a href={appPath("/")} className="flex h-20 items-center gap-3 border-b px-5">
          <span className="flex size-11 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ChefHat className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold text-foreground">Yes, Chef</span>
            <span className="block text-xs text-muted-foreground">Recipe workspace</span>
          </span>
        </a>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary navigation">
          {routes.map(route => {
            const Icon = route.icon;
            const active = pathname === route.path || (route.path !== "/" && pathname.startsWith(route.path));

            return (
              <a
                key={route.path}
                href={appPath(route.path)}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {route.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

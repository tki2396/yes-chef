import type { LucideIcon } from "lucide-react";
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileNav } from "./MobileNav";

export type AppRoute = {
  path: string;
  label: string;
  icon: LucideIcon;
};

type AppShellProps = {
  routes: AppRoute[];
  children: React.ReactNode;
};

export function AppShell({ routes, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DesktopSidebar routes={routes} />
      <div className="min-h-screen pb-24 md:pl-64 md:pb-0">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur md:hidden">
          <div className="flex h-16 items-center gap-3 px-4">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ChefHat className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Yes, Chef</p>
              <p className="mt-1 text-xs text-muted-foreground">Recipe workspace</p>
            </div>
          </div>
        </header>
        <main className={cn("mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8")}>{children}</main>
      </div>
      <MobileNav routes={routes} />
    </div>
  );
}

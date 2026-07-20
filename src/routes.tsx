import { BookOpen, ClipboardList, Import, Search, UserRound } from "lucide-react";
import type { AppRoute } from "@/components/layout/AppShell";
import { DraftPage } from "@/pages/DraftPage";
import { HomePage } from "@/pages/HomePage";
import { ImportPage } from "@/pages/ImportPage";
import { NewRecipePage } from "@/pages/NewRecipePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RecipeDetailPage } from "@/pages/RecipeDetailPage";
import { RecipesPage } from "@/pages/RecipesPage";

export const navigationRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Today",
    icon: ClipboardList,
  },
  {
    path: "/recipes",
    label: "Library",
    icon: BookOpen,
  },
  {
    path: "/import",
    label: "Import",
    icon: Import,
  },
  {
    path: "/drafts/sample",
    label: "Drafts",
    icon: Search,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: UserRound,
  },
];

type RouteMatch = {
  element: React.ReactNode;
};

export function matchRoute(pathname: string): RouteMatch {
  if (pathname === "/recipes/new") return { element: <NewRecipePage /> };
  if (pathname === "/recipes") return { element: <RecipesPage /> };
  if (pathname.startsWith("/recipes/")) {
    return { element: <RecipeDetailPage recipeId={pathname.split("/").at(-1)} /> };
  }
  if (pathname === "/import") return { element: <ImportPage /> };
  if (pathname.startsWith("/drafts/")) return { element: <DraftPage /> };
  if (pathname === "/profile") return { element: <ProfilePage /> };

  return { element: <HomePage /> };
}

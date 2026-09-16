import { Camera, Clock, GitBranch, Lock, Tag } from "lucide-react";
import { appPath } from "@/lib/routing";
import type { Recipe } from "@/types/recipe";

type RecipeListItemProps = {
  recipe: Recipe;
};

export function RecipeListItem({ recipe }: RecipeListItemProps) {
  const latestVersion = recipe.versions[0];

  return (
    <a
      href={appPath(`/recipes/${recipe.id}`)}
      className="grid gap-3 rounded-md border bg-card p-4 text-card-foreground transition-colors hover:bg-accent/40 sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-semibold">{recipe.title}</h2>
          <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {recipe.status === "draft" ? "Needs review" : "Active"}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{recipe.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-1 text-xs text-muted-foreground">
              <Tag className="size-3" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-2 text-xs text-muted-foreground sm:min-w-40 sm:justify-items-end">
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden="true" />
          {latestVersion?.activeTime ?? "time TBD"}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitBranch className="size-3.5" aria-hidden="true" />
          {recipe.versions.length} version{recipe.versions.length === 1 ? "" : "s"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Camera className="size-3.5" aria-hidden="true" />
          {recipe.mediaCount} photo{recipe.mediaCount === 1 ? "" : "s"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Lock className="size-3.5" aria-hidden="true" />
          {recipe.visibility}
        </span>
      </div>
    </a>
  );
}

import { BookOpen, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { RecipeListItem } from "@/components/recipes/RecipeListItem";
import { listRecipes } from "@/lib/recipe-api";
import { appPath } from "@/lib/routing";
import type { Recipe } from "@/types/recipe";

export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    listRecipes()
      .then(result => {
        if (!cancelled) setRecipes(result);
      })
      .catch(cause => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Unable to load recipes.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader
        kicker="Library"
        title="Recipe Library"
        description="Your local collection of recipes, drafts, versions, and flexible cooking notes."
        action={{ label: "New recipe", href: appPath("/recipes/new") }}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-3">
          {error ? (
            <EmptyState
              icon={CircleAlert}
              title="Could not load recipes"
              description={error}
              action={{ label: "Try again", href: appPath("/recipes") }}
            />
          ) : recipes === null ? (
            <div className="grid gap-3" aria-label="Loading recipes" aria-busy="true">
              {[1, 2, 3].map(item => (
                <div key={item} className="h-36 animate-pulse rounded-md border bg-muted/50" />
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Your library is empty"
              description="Log a recipe from memory or rough notes to start your local collection."
              action={{ label: "Log your first recipe", href: appPath("/recipes/new") }}
            />
          ) : (
            recipes.map(recipe => <RecipeListItem key={recipe.id} recipe={recipe} />)
          )}
        </div>
        <Section title="Local library" description="Recipes are stored in the SQLite database on this machine.">
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p>Recipes are private by default and can have multiple versions.</p>
            <p>Ingredients and steps belong to the version so each attempt can branch cleanly later.</p>
          </div>
        </Section>
      </div>
    </>
  );
}

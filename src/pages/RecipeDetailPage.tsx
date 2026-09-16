import { BookOpen, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { RecipeStats } from "@/components/recipes/RecipeStats";
import { getRecipe, RecipeApiError } from "@/lib/recipe-api";
import { appPath } from "@/lib/routing";
import type { Recipe } from "@/types/recipe";

type RecipeDetailPageProps = {
  recipeId?: string;
};

export function RecipeDetailPage({ recipeId = "" }: RecipeDetailPageProps) {
  const [recipe, setRecipe] = useState<Recipe>();
  const [error, setError] = useState<{ message: string; notFound: boolean }>();

  useEffect(() => {
    let cancelled = false;

    getRecipe(recipeId)
      .then(result => {
        if (!cancelled) setRecipe(result);
      })
      .catch(cause => {
        if (!cancelled) {
          setError({
            message: cause instanceof Error ? cause.message : "Unable to load the recipe.",
            notFound: cause instanceof RecipeApiError && cause.status === 404,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  if (error) {
    const Icon = error.notFound ? BookOpen : CircleAlert;
    const title = error.notFound ? "Recipe not found" : "Could not load recipe";
    return (
      <>
        <PageHeader
          kicker="Recipe"
          title={title}
          description={error.message}
          action={{ label: "Back to library", href: appPath("/recipes") }}
        />
        <EmptyState
          icon={Icon}
          title={title}
          description={error.notFound ? "This recipe may have been removed or the link may be incorrect." : error.message}
          action={{ label: "View library", href: appPath("/recipes") }}
        />
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <PageHeader kicker="Recipe" title="Loading recipe…" description="Reading your local recipe library." />
        <div className="h-96 animate-pulse rounded-md border bg-muted/50" aria-label="Loading recipe" aria-busy="true" />
      </>
    );
  }

  const version = recipe?.versions[0];

  if (!version) {
    return (
      <>
        <PageHeader
          kicker="Recipe"
          title="Recipe not found"
          description="This recipe does not have a version to display."
          action={{ label: "Back to library", href: appPath("/recipes") }}
        />
        <EmptyState
          icon={BookOpen}
          title="No matching recipe"
          description="Add a version before opening this recipe detail."
          action={{ label: "View library", href: appPath("/recipes") }}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Recipe" title={recipe.title} description={recipe.description || version.roughNotes} />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-4">
          <Section title="Metadata">
            <RecipeStats
              stats={[
                { label: "Active", value: version.activeTime ?? "TBD" },
                { label: "Passive", value: version.passiveTime ?? "TBD" },
                { label: "Servings", value: version.servings ?? "TBD" },
                { label: "Source", value: recipe.sourceLabel ?? version.source },
              ]}
            />
          </Section>
          <Section title="Ingredients">
            {version.ingredients.length ? (
              <ul className="grid gap-3">
                {version.ingredients.map(ingredient => (
                  <li key={ingredient.id} className="rounded-md border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium">{ingredient.label}</span>
                      {ingredient.amount ? (
                        <span className="shrink-0 text-sm text-muted-foreground">{ingredient.amount}</span>
                      ) : null}
                    </div>
                    {ingredient.notes ? <p className="mt-1 text-sm text-muted-foreground">{ingredient.notes}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No ingredients recorded yet.</p>
            )}
          </Section>
        </div>
        <div className="grid gap-4">
          <Section title="Instructions">
            {version.steps.length ? (
              <ol className="grid gap-3">
                {version.steps.map(step => (
                  <li key={step.id} className="grid grid-cols-[2rem_1fr] gap-3 rounded-md border bg-background p-3">
                    <span className="flex size-8 items-center justify-center rounded-md bg-muted text-sm font-semibold">
                      {step.order}
                    </span>
                    <div>
                      <p className="text-sm leading-6">{step.text}</p>
                      {step.duration ? (
                        <p className="mt-1 text-xs font-medium text-muted-foreground">{step.duration}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No instructions recorded yet.</p>
            )}
          </Section>
          <Section title="Version notes" description={version.label}>
            <div className="grid gap-4">
              {version.roughNotes ? (
                <div>
                  <h2 className="text-sm font-semibold">Rough notes</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{version.roughNotes}</p>
                </div>
              ) : null}
              {version.substitutionNotes?.length ? (
                <div>
                  <h2 className="text-sm font-semibold">Substitutions</h2>
                  <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
                    {version.substitutionNotes.map(note => (
                      <li key={note}>- {note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {version.outcomeNotes ? (
                <div>
                  <h2 className="text-sm font-semibold">Outcome</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{version.outcomeNotes}</p>
                </div>
              ) : null}
              {!version.roughNotes && !version.substitutionNotes?.length && !version.outcomeNotes ? (
                <p className="text-sm text-muted-foreground">No version notes recorded yet.</p>
              ) : null}
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

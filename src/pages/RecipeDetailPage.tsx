import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { RecipeStats } from "@/components/recipes/RecipeStats";
import { getRecipe } from "@/data/mockRecipes";
import { appPath } from "@/lib/routing";

type RecipeDetailPageProps = {
  recipeId?: string;
};

export function RecipeDetailPage({ recipeId = "" }: RecipeDetailPageProps) {
  const recipe = getRecipe(recipeId);
  const version = recipe?.versions[0];

  if (!recipe || !version) {
    return (
      <>
        <PageHeader
          kicker="Recipe"
          title="Recipe not found"
          description="This route is wired for recipe IDs from the mock library."
          action={{ label: "Back to library", href: appPath("/recipes") }}
        />
        <EmptyState
          icon={BookOpen}
          title="No matching recipe"
          description="Open a recipe from the library to view the current detail foundation."
          action={{ label: "View library", href: appPath("/recipes") }}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader kicker="Recipe" title={recipe.title} description={recipe.description} />
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
            <ul className="grid gap-3">
              {version.ingredients.map(ingredient => (
                <li key={ingredient.id} className="rounded-md border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium">{ingredient.label}</span>
                    {ingredient.amount ? <span className="shrink-0 text-sm text-muted-foreground">{ingredient.amount}</span> : null}
                  </div>
                  {ingredient.notes ? <p className="mt-1 text-sm text-muted-foreground">{ingredient.notes}</p> : null}
                </li>
              ))}
            </ul>
          </Section>
        </div>
        <div className="grid gap-4">
          <Section title="Instructions">
            <ol className="grid gap-3">
              {version.steps.map(step => (
                <li key={step.id} className="grid grid-cols-[2rem_1fr] gap-3 rounded-md border bg-background p-3">
                  <span className="flex size-8 items-center justify-center rounded-md bg-muted text-sm font-semibold">{step.order}</span>
                  <div>
                    <p className="text-sm leading-6">{step.text}</p>
                    {step.duration ? <p className="mt-1 text-xs font-medium text-muted-foreground">{step.duration}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
          <Section title="Version notes" description={version.label}>
            <div className="grid gap-4">
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
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

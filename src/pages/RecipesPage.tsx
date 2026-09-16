import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { RecipeListItem } from "@/components/recipes/RecipeListItem";
import { recipes } from "@/data/mockRecipes";
import { appPath } from "@/lib/routing";

export function RecipesPage() {
  return (
    <>
      <PageHeader
        kicker="Library"
        title="Recipe Library"
        description="Mock-backed recipe primitives for capture, imports, versions, and flexible cooking notes."
        action={{ label: "New recipe", href: appPath("/recipes/new") }}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-3">
          {recipes.map(recipe => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </div>
        <Section title="Library shape" description="These cards are temporary mock data, but the fields map to the planned recipe/version model.">
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p>Recipes are private by default and can have multiple versions.</p>
            <p>Ingredients and steps belong to the version so each attempt can branch cleanly later.</p>
          </div>
        </Section>
      </div>
    </>
  );
}

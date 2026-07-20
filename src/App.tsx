import { BookOpen, ClipboardList, Import, Search, UserRound } from "lucide-react";
import "./index.css";
import { AppShell } from "./components/layout/AppShell";
import { EmptyState } from "./components/layout/EmptyState";
import { PageHeader } from "./components/layout/PageHeader";
import { Section } from "./components/layout/Section";
import { RecipeListItem } from "./components/recipes/RecipeListItem";
import { RecipeStats } from "./components/recipes/RecipeStats";
import { getRecipe, recipes } from "./data/mockRecipes";
import { appPath, getAppPath } from "./lib/routing";

const routes = [
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

function getRoute(pathname: string) {
  pathname = getAppPath(pathname);

  if (pathname === "/recipes/new") return "new-recipe";
  if (pathname.startsWith("/recipes/") && pathname !== "/recipes") return "recipe-detail";
  if (pathname === "/recipes") return "recipes";
  if (pathname === "/import") return "import";
  if (pathname.startsWith("/drafts/")) return "draft";
  if (pathname === "/profile") return "profile";
  return "home";
}

function HomePage() {
  return (
    <>
      <PageHeader
        kicker="Mobile-first foundation"
        title="Yes, Chef"
        description="A responsive recipe workspace for capture, imports, iteration, and cooking notes."
        action={{ label: "Log recipe", href: appPath("/recipes/new") }}
      />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Section title="Next foundation slice" description="Build the core recipe primitives before deeper feature work.">
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p>Set up the library, create flow, import review, and recipe detail surfaces with mock data first.</p>
            <p>Keep recipes private by default and flexible enough for incomplete measurements, rough notes, and versions.</p>
          </div>
        </Section>
        <Section title="Current scope" description="This pass intentionally stops at shell and route scaffolding.">
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>Mobile bottom navigation</li>
            <li>Desktop sidebar navigation</li>
            <li>Responsive content region</li>
            <li>Placeholder route surfaces</li>
          </ul>
        </Section>
      </div>
    </>
  );
}

function RecipesPage() {
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

function NewRecipePage() {
  return (
    <>
      <PageHeader
        kicker="Create"
        title="Log a Recipe"
        description="This placeholder marks the manual capture workflow: flexible ingredients, rough notes, substitutions, ratings, and photos."
      />
      <Section title="Form sections planned">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {["Basics", "Time & servings", "Ingredients", "Instructions", "Substitutions", "Ratings & media"].map(item => (
            <div key={item} className="rounded-md border bg-card p-4 text-sm font-medium">
              {item}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function RecipeDetailPage() {
  const recipeId = getAppPath(window.location.pathname).split("/").at(-1) ?? "";
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
      <PageHeader
        kicker="Recipe"
        title={recipe.title}
        description={recipe.description}
      />
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
                  <h3 className="text-sm font-semibold">Substitutions</h3>
                  <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
                    {version.substitutionNotes.map(note => (
                      <li key={note}>- {note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {version.outcomeNotes ? (
                <div>
                  <h3 className="text-sm font-semibold">Outcome</h3>
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

function ImportPage() {
  return (
    <>
      <PageHeader
        kicker="Import"
        title="Import Recipe"
        description="Paste text, links, PDFs, images, notes, or verbal directions into a reviewable recipe draft."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Original source" description="Mobile stacks this above parsed fields; desktop can show both side by side." />
        <Section title="Parsed draft" description="Users review and correct before saving anything as a recipe." />
      </div>
    </>
  );
}

function DraftPage() {
  return (
    <>
      <PageHeader
        kicker="Draft review"
        title="Recipe Draft"
        description="A future review surface for imports and AI-assisted parsing before a recipe is saved."
      />
      <EmptyState
        icon={ClipboardList}
        title="Draft review scaffold"
        description="Drafts stay editable and private until the user saves them into the recipe library."
      />
    </>
  );
}

function ProfilePage() {
  return (
    <>
      <PageHeader
        kicker="Account"
        title="Profile"
        description="Preferences, dietary context, public contribution settings, and account details will land here."
      />
      <Section title="Profile foundation" description="Authentication is out of scope for this first slice." />
    </>
  );
}

function CurrentPage() {
  const route = getRoute(window.location.pathname);

  if (route === "recipes") return <RecipesPage />;
  if (route === "new-recipe") return <NewRecipePage />;
  if (route === "recipe-detail") return <RecipeDetailPage />;
  if (route === "import") return <ImportPage />;
  if (route === "draft") return <DraftPage />;
  if (route === "profile") return <ProfilePage />;
  return <HomePage />;
}

export function App() {
  return (
    <AppShell routes={routes}>
      <CurrentPage />
    </AppShell>
  );
}

export default App;

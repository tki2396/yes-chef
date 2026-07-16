import { BookOpen, ClipboardList, Import, Search, UserRound } from "lucide-react";
import "./index.css";
import { AppShell } from "./components/layout/AppShell";
import { EmptyState } from "./components/layout/EmptyState";
import { PageHeader } from "./components/layout/PageHeader";
import { Section } from "./components/layout/Section";
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
        description="Your saved recipes, imports, and future versions will live here."
        action={{ label: "New recipe", href: appPath("/recipes/new") }}
      />
      <EmptyState
        icon={BookOpen}
        title="No recipes yet"
        description="Start with a rough note, a polished recipe, or an import. The foundation supports incomplete recipes from the beginning."
        action={{ label: "Log first recipe", href: appPath("/recipes/new") }}
      />
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
  return (
    <>
      <PageHeader
        kicker="Recipe"
        title="Recipe Detail"
        description="This route will become the cooking surface with ingredients, steps, notes, source attribution, and versions."
      />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Section title="Ingredients & metadata" />
        <Section title="Instructions, notes, versions" />
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

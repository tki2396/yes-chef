import { ArrowRight, Check, Circle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { appPath } from "@/lib/routing";

const completedWork = [
  "Responsive app shell and navigation for phone and desktop",
  "Core routes for Today, Library, recipe details, creation, imports, drafts, and profile",
  "Private-first recipe model with versions, ingredients, steps, tags, media, and imports",
  "Local SQLite database with migrations, seed data, repository tests, and a recipe API",
  "Working recipe library, recipe detail, and quick capture with a title and rough notes",
  "GitHub Pages navigation fixes, local Pages preview, and Bun 1.4.2 upgrade",
];

const buildOrder = [
  {
    title: "Finish Recipe Log/Create",
    description:
      "Turn quick capture into the full flexible form: time, servings, ingredients, instructions, tags, ratings, photos, substitutions, and version notes.",
    label: "Next",
  },
  {
    title: "Make the Library easier to use",
    description: "Add search and filters for tags, recent recipes, favorites, and recipes that need review.",
    label: "Planned",
  },
  {
    title: "Build photo/screenshot import and draft review",
    description:
      "Upload or paste an image, extract the visible recipe, keep the original beside an editable draft, and allow incomplete saves when parsing is uncertain.",
    label: "Planned",
  },
  {
    title: "Harden the main flows",
    description: "Add form and display tests, responsive checks, keyboard support, labels, and dependable error states.",
    label: "Planned",
  },
];

const laterWork = [
  "Recipe genealogy and richer version comparisons",
  "Pasted text, URL, PDF, handwriting, and YouTube imports",
  "Accounts, cloud sync, and public recipe sharing",
  "Cooking with friends and local meal coordination",
  "Plate selling, payments, reputation, and moderation",
];

export function HomePage() {
  return (
    <>
      <PageHeader
        kicker="Project tracker"
        title="Today"
        description="A plain-language snapshot of what works, what comes next, and what we are intentionally saving for later. Update this page whenever a piece of work is merged."
        action={{ label: "Open current feature", href: appPath("/recipes/new") }}
      />

      <div className="grid gap-4">
        <Section
          title="Current milestone"
          description="The technical foundation is usable. Product work now starts with the core recipe-logging experience."
        >
          <div className="rounded-lg border bg-background p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                Next up
              </span>
              <span className="text-xs font-medium text-muted-foreground">First real feature</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Finish Recipe Log/Create</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              A cook can already save a title and rough notes. The next job is to make the rest of the recipe editable without
              losing the fast, informal capture flow.
            </p>
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
              href={appPath("/recipes/new")}
            >
              See the current recipe form
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <div className="mt-3 rounded-lg bg-muted/60 p-4 text-sm leading-6">
            <p className="font-semibold">Where it works today</p>
            <p className="mt-1 text-muted-foreground">
              The local app can load and save recipes through its SQLite database. GitHub Pages is a static preview for the
              interface and this tracker; it cannot run the recipe server or database yet.
            </p>
          </div>
        </Section>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Section title="What works now" description="These pieces are built and form the base for feature work.">
            <ul className="grid gap-3">
              {completedWork.map(item => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Build order"
            description="Work from the top. Finish and merge one useful slice before starting the next."
          >
            <ol className="grid gap-3">
              {buildOrder.map((item, index) => (
                <li key={item.title} className="rounded-lg border bg-background p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Section
            title="Later, not next"
            description="Important ideas that should not distract from making the recipe core useful first."
          >
            <ul className="grid gap-2.5">
              {laterWork.map(item => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <Circle aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="For someone building with Claude Code"
            description="You should not need to inspect the codebase to choose the next task."
          >
            <div className="rounded-lg bg-muted/60 p-4">
              <div className="flex gap-3">
                <Sparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <div className="text-sm leading-6">
                  <p className="font-semibold">Use the first unfinished item in Build order.</p>
                  <p className="mt-1 text-muted-foreground">
                    Ask Claude Code to implement one reviewable slice, test it locally, and update this Today page when the work
                    is merged. Keep recipes private and allow incomplete or approximate cooking notes.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

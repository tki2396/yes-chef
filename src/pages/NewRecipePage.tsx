import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSections = [
  {
    title: "Basics",
    fields: ["Title", "Rough notes", "Tags"],
  },
  {
    title: "Time & servings",
    fields: ["Active time", "Passive time", "Servings"],
  },
  {
    title: "Ingredients",
    fields: ["Flexible ingredient rows", "Approximate amounts", "Replacement notes"],
  },
  {
    title: "Instructions",
    fields: ["Long instructions", "Short version", "Timing/temp feedback"],
  },
  {
    title: "Iteration",
    fields: ["Substitutions tried", "Outcome notes", "Next time"],
  },
  {
    title: "Ratings & media",
    fields: ["Taste rating", "Effort rating", "Photos"],
  },
];

export function NewRecipePage() {
  return (
    <>
      <PageHeader
        kicker="Create"
        title="Log a Recipe"
        description="A static scaffold for the manual capture workflow: flexible ingredients, rough notes, substitutions, ratings, and photos."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Section title="Quick capture">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recipe-title">Recipe title</Label>
              <Input id="recipe-title" placeholder="Brown butter cookies, tomato beans, grandma's stew..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipe-notes">Rough notes</Label>
              <textarea
                id="recipe-notes"
                placeholder="Loose directions, memory, substitutions, things to remember..."
                className="min-h-36 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-ring/50 transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-1 focus-visible:ring-4"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" type="button">
                Save draft
              </Button>
              <Button type="button">Continue</Button>
            </div>
          </div>
        </Section>
        <Section title="Planned sections" description="These become real form modules after the data layer is ready.">
          <div className="grid gap-3">
            {formSections.map(section => (
              <div key={section.title} className="rounded-md border bg-background p-3">
                <h2 className="text-sm font-semibold">{section.title}</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{section.fields.join(" / ")}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

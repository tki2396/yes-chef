import { Clipboard, FileImage, Link, Mic } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

const importSources = [
  { label: "Paste text", icon: Clipboard },
  { label: "Recipe URL", icon: Link },
  { label: "Photo or PDF", icon: FileImage },
  { label: "Verbal notes", icon: Mic },
];

export function ImportPage() {
  return (
    <>
      <PageHeader
        kicker="Import"
        title="Import Recipe"
        description="Paste text, links, PDFs, images, notes, or verbal directions into a reviewable recipe draft."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Original source" description="Mobile stacks this above parsed fields; desktop can show both side by side.">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              {importSources.map(source => {
                const Icon = source.icon;
                return (
                  <button key={source.label} type="button" className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border bg-background p-3 text-sm font-medium">
                    <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                    {source.label}
                  </button>
                );
              })}
            </div>
            <textarea
              placeholder="Paste a recipe, rough notes, transcript, Reddit comment, or anything else here..."
              className="min-h-48 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-ring/50 transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-1 focus-visible:ring-4"
            />
          </div>
        </Section>
        <Section title="Parsed draft" description="Users review and correct before saving anything as a recipe.">
          <div className="grid gap-3">
            {["Title", "Ingredients", "Instructions", "Time", "Servings", "Source attribution"].map(field => (
              <div key={field} className="rounded-md border border-dashed bg-background p-3">
                <p className="text-sm font-medium">{field}</p>
                <p className="mt-1 text-xs text-muted-foreground">Needs review</p>
              </div>
            ))}
            <Button type="button" className="mt-2">
              Save as recipe draft
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}

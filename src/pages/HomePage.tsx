import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { appPath } from "@/lib/routing";

export function HomePage() {
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
        <Section title="Current scope" description="This pass intentionally stops at frontend foundation.">
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>Centralized route matching</li>
            <li>Page modules split from the app shell</li>
            <li>Mock-backed recipe primitives</li>
            <li>Create/import scaffolds</li>
          </ul>
        </Section>
      </div>
    </>
  );
}

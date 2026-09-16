import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createRecipe } from "@/lib/recipe-api";
import { appPath } from "@/lib/routing";

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

const quickCaptureSchema = z.object({
  title: z.string().trim().min(1, "Give the recipe a title.").max(200),
  roughNotes: z.string().trim().max(20_000),
});

type QuickCaptureValues = z.infer<typeof quickCaptureSchema>;

export function NewRecipePage() {
  const [submitError, setSubmitError] = useState<string>();
  const form = useForm<QuickCaptureValues>({
    resolver: zodResolver(quickCaptureSchema),
    defaultValues: { title: "", roughNotes: "" },
  });

  async function onSubmit(values: QuickCaptureValues) {
    setSubmitError(undefined);

    try {
      const recipe = await createRecipe({
        title: values.title,
        version: { roughNotes: values.roughNotes || undefined },
      });
      window.location.assign(appPath(`/recipes/${recipe.id}`));
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Unable to save the recipe.");
    }
  }

  return (
    <>
      <PageHeader
        kicker="Create"
        title="Log a Recipe"
        description="Capture a title and whatever you remember. You can add structure and polish later."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Section title="Quick capture">
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brown butter cookies, tomato beans, grandma's stew..." autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roughNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rough notes</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Loose directions, memory, substitutions, things to remember..."
                        className="min-h-36 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-ring/50 transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-1 focus-visible:ring-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {submitError ? (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {submitError}
                </p>
              ) : null}
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving…" : "Save recipe"}
                </Button>
              </div>
            </form>
          </Form>
        </Section>
        <Section title="Coming next" description="Quick capture works now; these sections will become editable modules.">
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

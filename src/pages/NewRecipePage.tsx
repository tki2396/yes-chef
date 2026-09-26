import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createRecipe } from "@/lib/recipe-api";
import { appPath } from "@/lib/routing";

const textAreaClass =
  "min-h-28 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-ring/50 transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-1 focus-visible:ring-4 aria-invalid:border-destructive";
const optionalText = (maximum: number) => z.string().trim().max(maximum);
const flexibleRow = z.object({ label: optionalText(500), amount: optionalText(200), notes: optionalText(1_000) });

const recipeFormSchema = z.object({
  title: z.string().trim().min(1, "Give the recipe a title.").max(200),
  description: optionalText(5_000),
  roughNotes: optionalText(20_000),
  tags: optionalText(2_000),
  versionLabel: optionalText(200),
  activeTime: optionalText(200),
  passiveTime: optionalText(200),
  servings: optionalText(200),
  ingredients: z.array(flexibleRow).max(500).superRefine((rows, context) => {
    rows.forEach((row, index) => {
      if (!row.label && (row.amount || row.notes)) context.addIssue({ code: "custom", path: [index, "label"], message: "Add an ingredient name or clear this row." });
    });
  }),
  steps: z.array(z.object({ text: optionalText(5_000), duration: optionalText(200) })).max(500).superRefine((rows, context) => {
    rows.forEach((row, index) => {
      if (!row.text && row.duration) context.addIssue({ code: "custom", path: [index, "text"], message: "Add an instruction or clear the timing." });
    });
  }),
  substitutions: z.array(z.object({ note: optionalText(1_000) })).max(100),
  outcomeNotes: optionalText(20_000),
  rating: z.enum(["", "1", "2", "3", "4", "5"]),
  effortRating: z.enum(["", "1", "2", "3", "4", "5"]),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;
type PhotoDraft = { id: string; file: File; caption: string };

const defaultValues: RecipeFormValues = {
  title: "", description: "", roughNotes: "", tags: "", versionLabel: "Original",
  activeTime: "", passiveTime: "", servings: "",
  ingredients: [{ label: "", amount: "", notes: "" }],
  steps: [{ text: "", duration: "" }], substitutions: [], outcomeNotes: "", rating: "", effortRating: "",
};

function present(value: string) {
  return value.trim() || undefined;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(new Error(`Unable to read ${file.name}.`)));
    reader.readAsDataURL(file);
  });
}

export function NewRecipePage() {
  const [submitError, setSubmitError] = useState<string>();
  const [photoError, setPhotoError] = useState<string>();
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const photoInput = useRef<HTMLInputElement>(null);
  const form = useForm<RecipeFormValues>({ resolver: zodResolver(recipeFormSchema), defaultValues });
  const ingredients = useFieldArray({ control: form.control, name: "ingredients" });
  const steps = useFieldArray({ control: form.control, name: "steps" });
  const substitutions = useFieldArray({ control: form.control, name: "substitutions" });

  function addPhotos(files: FileList | null) {
    setPhotoError(undefined);
    if (!files?.length) return;
    const selected = Array.from(files);
    if (photos.length + selected.length > 8) return setPhotoError("Add no more than 8 photos at a time.");
    if (selected.some(file => !["image/gif", "image/jpeg", "image/png", "image/webp"].includes(file.type))) return setPhotoError("Choose PNG, JPEG, WebP, or GIF images.");
    if (selected.some(file => file.size > 5 * 1024 * 1024)) return setPhotoError("Each photo must be 5 MB or smaller.");
    setPhotos(current => [...current, ...selected.map(file => ({ id: crypto.randomUUID(), file, caption: "" }))]);
    if (photoInput.current) photoInput.current.value = "";
  }

  async function onSubmit(values: RecipeFormValues) {
    setSubmitError(undefined);
    try {
      const media = await Promise.all(photos.map(async photo => ({ dataUrl: await fileToDataUrl(photo.file), caption: present(photo.caption) })));
      const recipe = await createRecipe({
        title: values.title,
        description: present(values.description),
        version: {
          label: present(values.versionLabel), roughNotes: present(values.roughNotes),
          activeTime: present(values.activeTime), passiveTime: present(values.passiveTime), servings: present(values.servings),
          ingredients: values.ingredients.filter(row => row.label).map(row => ({ label: row.label, amount: present(row.amount), notes: present(row.notes) })),
          steps: values.steps.filter(row => row.text).map(row => ({ text: row.text, duration: present(row.duration) })),
          substitutionNotes: values.substitutions.map(row => row.note).filter(Boolean),
          outcomeNotes: present(values.outcomeNotes),
          rating: values.rating ? Number(values.rating) : undefined,
          effortRating: values.effortRating ? Number(values.effortRating) : undefined,
          tags: values.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        },
        media,
      });
      window.location.assign(appPath(`/recipes/${recipe.id}`));
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Unable to save the recipe.");
    }
  }

  return (
    <>
      <PageHeader kicker="Create" title="Log a Recipe" description="Start with whatever you remember. Every section is optional except the title, so incomplete and approximate notes are welcome." />
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="grid gap-4">
              <Section title="Basics" description="Name it now; add only as much context as you have.">
                <div className="grid gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Recipe title</FormLabel><FormControl><Input placeholder="Brown butter cookies, tomato beans…" autoFocus {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Short description</FormLabel><FormControl><textarea className={textAreaClass} placeholder="What this recipe is, when you make it, or why it matters…" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="roughNotes" render={({ field }) => (<FormItem><FormLabel>Rough notes</FormLabel><FormControl><textarea className={textAreaClass} placeholder="Loose directions, memories, uncertainties, or anything that does not fit below…" {...field} /></FormControl><FormDescription>These stay with this version of the recipe.</FormDescription><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="weeknight, baking, grandma's" {...field} /></FormControl><FormDescription>Separate tags with commas.</FormDescription><FormMessage /></FormItem>)} />
                </div>
              </Section>

              <Section title="Ingredients" description="Amounts can be exact, approximate, or omitted.">
                <div className="grid gap-3">
                  {ingredients.fields.map((item, index) => (
                    <div key={item.id} className="grid gap-3 rounded-md border bg-background p-3 sm:grid-cols-[0.75fr_1fr_1fr_auto] sm:items-start">
                      <FormField control={form.control} name={`ingredients.${index}.amount`} render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input placeholder="about 2 cups" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`ingredients.${index}.label`} render={({ field }) => (<FormItem><FormLabel>Ingredient</FormLabel><FormControl><Input placeholder="tomatoes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`ingredients.${index}.notes`} render={({ field }) => (<FormItem><FormLabel>Notes / replacement</FormLabel><FormControl><Input placeholder="or canned; whatever is ripe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" className="mt-6" aria-label={`Remove ingredient ${index + 1}`} onClick={() => ingredients.remove(index)}><Trash2 /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="justify-self-start" onClick={() => ingredients.append({ label: "", amount: "", notes: "" })}><Plus /> Add ingredient</Button>
                </div>
              </Section>

              <Section title="Instructions" description="Add one useful step or the whole method. Timing and temperature notes can stay approximate.">
                <div className="grid gap-3">
                  {steps.fields.map((item, index) => (
                    <div key={item.id} className="grid gap-3 rounded-md border bg-background p-3 sm:grid-cols-[2rem_1fr_12rem_auto] sm:items-start">
                      <span className="mt-6 flex size-8 items-center justify-center rounded-md bg-muted text-sm font-semibold">{index + 1}</span>
                      <FormField control={form.control} name={`steps.${index}.text`} render={({ field }) => (<FormItem><FormLabel>Instruction</FormLabel><FormControl><textarea className={`${textAreaClass} min-h-20`} placeholder="Cook until it looks right…" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`steps.${index}.duration`} render={({ field }) => (<FormItem><FormLabel>Time / temperature</FormLabel><FormControl><Input placeholder="10 min at 375°F" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" className="mt-6" aria-label={`Remove instruction ${index + 1}`} onClick={() => steps.remove(index)}><Trash2 /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="justify-self-start" onClick={() => steps.append({ text: "", duration: "" })}><Plus /> Add instruction</Button>
                </div>
              </Section>
            </div>

            <div className="grid content-start gap-4">
              <Section title="Time & servings">
                <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  <FormField control={form.control} name="activeTime" render={({ field }) => (<FormItem><FormLabel>Active time</FormLabel><FormControl><Input placeholder="about 20 min" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="passiveTime" render={({ field }) => (<FormItem><FormLabel>Passive time</FormLabel><FormControl><Input placeholder="1 hour to rise" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="servings" render={({ field }) => (<FormItem><FormLabel>Servings / yield</FormLabel><FormControl><Input placeholder="4-ish or 12 cookies" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </Section>

              <Section title="Version & results" description="Record what changed and how this attempt went.">
                <div className="grid gap-4">
                  <FormField control={form.control} name="versionLabel" render={({ field }) => (<FormItem><FormLabel>Version name</FormLabel><FormControl><Input placeholder="Original, less sweet test…" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid gap-3">
                    {substitutions.fields.map((item, index) => (<div key={item.id} className="flex items-start gap-2"><FormField control={form.control} name={`substitutions.${index}.note`} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Substitution {index + 1}</FormLabel><FormControl><Input placeholder="Used yogurt instead of sour cream" {...field} /></FormControl><FormMessage /></FormItem>)} /><Button type="button" variant="ghost" size="icon" className="mt-6" aria-label={`Remove substitution ${index + 1}`} onClick={() => substitutions.remove(index)}><Trash2 /></Button></div>))}
                    <Button type="button" variant="outline" className="justify-self-start" onClick={() => substitutions.append({ note: "" })}><Plus /> Add substitution</Button>
                  </div>
                  <FormField control={form.control} name="outcomeNotes" render={({ field }) => (<FormItem><FormLabel>Outcome / next time</FormLabel><FormControl><textarea className={textAreaClass} placeholder="What worked, what did not, and what to try next…" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="rating" render={({ field }) => (<FormItem><FormLabel>Taste</FormLabel><FormControl><select className="h-9 rounded-md border bg-transparent px-3 text-sm" {...field}><option value="">Not rated</option>{[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} / 5</option>)}</select></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="effortRating" render={({ field }) => (<FormItem><FormLabel>Effort</FormLabel><FormControl><select className="h-9 rounded-md border bg-transparent px-3 text-sm" {...field}><option value="">Not rated</option>{[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} / 5</option>)}</select></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>
              </Section>

              <Section title="Photos" description="Attach up to 8 photos. They stay in your local recipe database.">
                <div className="grid gap-3">
                  <Input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple aria-label="Add recipe photos" onChange={event => addPhotos(event.target.files)} />
                  {photos.map(photo => (<div key={photo.id} className="grid gap-2 rounded-md border bg-background p-3"><div className="flex items-center gap-2"><Camera className="size-4 shrink-0" /><span className="min-w-0 flex-1 truncate text-sm font-medium">{photo.file.name}</span><Button type="button" variant="ghost" size="icon" aria-label={`Remove ${photo.file.name}`} onClick={() => setPhotos(current => current.filter(item => item.id !== photo.id))}><Trash2 /></Button></div><Input value={photo.caption} aria-label={`Caption for ${photo.file.name}`} placeholder="Optional caption" onChange={event => setPhotos(current => current.map(item => item.id === photo.id ? { ...item, caption: event.target.value } : item))} /></div>))}
                  {photoError ? <p role="alert" className="text-sm font-medium text-destructive">{photoError}</p> : null}
                </div>
              </Section>

              <div className="rounded-md border bg-muted/50 p-4 text-sm leading-6"><p className="font-semibold">Private by default</p><p className="text-muted-foreground">This saves as a private draft. Blank sections remain editable later.</p></div>
            </div>
          </div>

          {submitError ? <p role="alert" className="text-sm font-medium text-destructive">{submitError}</p> : null}
          <div className="sticky bottom-4 flex justify-end rounded-md border bg-background/95 p-3 shadow-lg backdrop-blur"><Button type="submit" size="lg" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save private recipe"}</Button></div>
        </form>
      </Form>
    </>
  );
}

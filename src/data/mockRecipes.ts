import type { Recipe } from "@/types/recipe";

export const recipes: Recipe[] = [
  {
    id: "spicy-tomato-beans",
    title: "Spicy Tomato Beans",
    description: "A flexible pantry dinner built around canned beans, tomato, aromatics, and whatever greens are around.",
    status: "active",
    visibility: "private",
    tags: ["weeknight", "pantry", "vegetarian"],
    updatedAt: "2026-07-18",
    sourceLabel: "manual note",
    mediaCount: 2,
    versions: [
      {
        id: "spicy-tomato-beans-v1",
        recipeId: "spicy-tomato-beans",
        label: "Latest attempt",
        createdAt: "2026-07-18",
        source: "manual",
        visibility: "private",
        activeTime: "15 min",
        passiveTime: "25 min",
        servings: "3-4",
        rating: 4,
        effortRating: 2,
        ingredients: [
          { id: "beans", label: "cannellini beans", amount: "2 cans", notes: "drained, not rinsed" },
          { id: "tomato", label: "crushed tomatoes", amount: "1 cup" },
          { id: "greens", label: "kale or spinach", amount: "2 handfuls", notes: "optional but useful" },
          { id: "heat", label: "chili crisp or red pepper flakes", amount: "to taste" },
        ],
        steps: [
          { id: "s1", order: 1, text: "Soften onion and garlic in olive oil until sweet but not browned." },
          { id: "s2", order: 2, text: "Add tomato, beans, and heat; simmer until thick enough to spoon over toast.", duration: "20 min" },
          { id: "s3", order: 3, text: "Fold in greens at the end and finish with acid, herbs, or cheese." },
        ],
        substitutionNotes: ["Tomatoes can cover for missing bell peppers.", "Chickpeas work but need more olive oil."],
        outcomeNotes: "Best with toasted sourdough. Next time try smoked paprika earlier.",
      },
    ],
  },
  {
    id: "ginger-scallion-noodles",
    title: "Ginger Scallion Noodles",
    description: "Loose ratio recipe for fast noodles with a punchy ginger-scallion oil and optional protein.",
    status: "draft",
    visibility: "private",
    tags: ["quick", "noodles", "sauce"],
    updatedAt: "2026-07-16",
    sourceLabel: "import draft",
    mediaCount: 0,
    versions: [
      {
        id: "ginger-scallion-noodles-v1",
        recipeId: "ginger-scallion-noodles",
        label: "Imported draft",
        createdAt: "2026-07-16",
        source: "import",
        visibility: "private",
        activeTime: "10 min",
        servings: "2",
        ingredients: [
          { id: "noodles", label: "wheat noodles", amount: "2 portions" },
          { id: "scallions", label: "scallions", amount: "1 bunch", notes: "thin sliced" },
          { id: "ginger", label: "fresh ginger", amount: "a lot", notes: "needs exact amount later" },
        ],
        steps: [
          { id: "s1", order: 1, text: "Pour hot oil over ginger and scallions." },
          { id: "s2", order: 2, text: "Toss cooked noodles with sauce and loosen with noodle water." },
        ],
        substitutionNotes: ["Add rotisserie chicken or tofu if this needs to be dinner."],
      },
    ],
  },
  {
    id: "brown-butter-cookies",
    title: "Brown Butter Cookies",
    description: "Cookie recipe that mostly follows a familiar method, with notes only where the process differs.",
    status: "active",
    visibility: "private",
    tags: ["baking", "dessert", "iteration"],
    updatedAt: "2026-07-10",
    sourceLabel: "adapted from web recipe",
    mediaCount: 4,
    versions: [
      {
        id: "brown-butter-cookies-v2",
        recipeId: "brown-butter-cookies",
        label: "Less sweet test",
        createdAt: "2026-07-10",
        source: "variation",
        visibility: "private",
        activeTime: "25 min",
        passiveTime: "1 hr chill",
        servings: "18 cookies",
        rating: 5,
        effortRating: 3,
        ingredients: [
          { id: "butter", label: "brown butter", amount: "1 stick", notes: "cool before mixing" },
          { id: "sugar", label: "brown sugar", amount: "reduced by 20%" },
          { id: "flour", label: "flour", amount: "standard amount" },
        ],
        steps: [
          { id: "s1", order: 1, text: "Brown butter until nutty, then cool until opaque but not solid." },
          { id: "s2", order: 2, text: "Mix like a standard cookie dough; chill before baking." },
          { id: "s3", order: 3, text: "Pull earlier than expected; carryover keeps the center soft.", duration: "9-10 min" },
        ],
        substitutionNotes: ["Less sugar helped texture more than expected."],
        outcomeNotes: "Best version so far. Keep this as the default branch.",
      },
    ],
  },
];

export function getRecipe(recipeId: string) {
  return recipes.find(recipe => recipe.id === recipeId);
}

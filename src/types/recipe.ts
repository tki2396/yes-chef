export type RecipeVisibility = "private" | "public";

export type RecipeStatus = "draft" | "active" | "archived";

export type Ingredient = {
  id: string;
  label: string;
  amount?: string;
  notes?: string;
};

export type RecipeStep = {
  id: string;
  order: number;
  text: string;
  duration?: string;
};

export type RecipeVersion = {
  id: string;
  recipeId: string;
  parentVersionId?: string;
  label: string;
  createdAt: string;
  source: "manual" | "import" | "variation";
  visibility: RecipeVisibility;
  roughNotes?: string;
  activeTime?: string;
  passiveTime?: string;
  servings?: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  substitutionNotes?: string[];
  outcomeNotes?: string;
  rating?: number;
  effortRating?: number;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  status: RecipeStatus;
  visibility: RecipeVisibility;
  tags: string[];
  updatedAt: string;
  sourceLabel?: string;
  mediaCount: number;
  versions: RecipeVersion[];
};

export type RecipeType = {
  id?: string; // unique identifier
  title: string; // title of the recipe
  description: string; // description of the recipe
  image?: string; // image of the recipe (url or base64)
  ingredients: string[]; // array of strings
  steps: string[]; // array of strings
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  difficulty?: number; // 1-5
  servings?: number; // number of servings
  isCustom?: boolean; // is the recipe custom or from the database
  isGenerated?: boolean; // is the recipe generated or not
  uuid?: string; // unique identifier
};

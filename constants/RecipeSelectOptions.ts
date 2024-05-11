export type SheetModalContentType = {
  title: string;
  data: number[];
  info: string;
};

const RecipeSelectOptions: { [key: string]: SheetModalContentType } = {
  servings: {
    title: "Servings",
    data: Array.from({ length: 20 }, (_, i) => i + 1),
    info: "Number of servings",
  },
  prepTime: {
    title: "Prep Time",
    data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    info: "Select the time it takes to prepare the recipe.",
  },
  cookTime: {
    title: "Cook Time",
    data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    info: "Select the time it takes to cook the recipe.",
  },
};

export default RecipeSelectOptions;

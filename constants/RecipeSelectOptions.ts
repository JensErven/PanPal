import { SheetModalContentType } from "@/models/SheetModalContentType";
import { cuisineTypes } from "./tastePreferences/CuisineTypes";
import { mealTypes } from "./tastePreferences/MealTypes";

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
  mealType: {
    title: "Meal Type",
    data: mealTypes,
    info: "Select the meal type",
  },
  cuisineType: {
    title: "Cuisine Type",
    data: cuisineTypes.map((cuisine) => cuisine.name),
    info: "Select the cuisine type",
  },
};

export default RecipeSelectOptions;

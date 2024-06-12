import { RecipeType } from "@/models/RecipeType";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeSuggestedRecipe = async (recipe: RecipeType) => {
  try {
    console.log("recipe", recipe);
    const storedRecipes = await AsyncStorage.getItem("suggestedRecipes");
    const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

    const updatedRecipes = [...parsedRecipes, recipe];
    await AsyncStorage.setItem(
      "suggestedRecipes",
      JSON.stringify(updatedRecipes)
    );
  } catch (e) {
    console.error("Error saving suggested recipe:", e);
  }
};

const getSuggestedRecipes = async () => {
  try {
    const value = await AsyncStorage.getItem("suggestedRecipes");
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error("Error reading suggested recipes:", e);
    return [];
  }
};

const getSuggestedRecipe = async (recipeId: string) => {
  try {
    const storedRecipes = await AsyncStorage.getItem("suggestedRecipes");
    const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

    return parsedRecipes.find((recipe: RecipeType) => recipe.id === recipeId);
  } catch (e) {
    console.error("Error getting suggested recipe:", e);
    return null;
  }
};

const clearSuggestedRecipes = async () => {
  try {
    await AsyncStorage.removeItem("suggestedRecipes");
  } catch (e) {
    console.error("Error clearing suggested recipes:", e);
  }
};

const deleteSuggestedRecipe = async (recipeId: string) => {
  try {
    const storedRecipes = await AsyncStorage.getItem("suggestedRecipes");
    const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

    const updatedRecipes = parsedRecipes.filter(
      (recipe: RecipeType) => recipe.id !== recipeId
    );
    await AsyncStorage.setItem(
      "suggestedRecipes",
      JSON.stringify(updatedRecipes)
    );
  } catch (e) {
    console.error("Error deleting suggested recipe:", e);
  }
};

export const recipeSuggestionService = {
  storeSuggestedRecipe,
  getSuggestedRecipes,
  clearSuggestedRecipes,
  deleteSuggestedRecipe,
  getSuggestedRecipe,
};

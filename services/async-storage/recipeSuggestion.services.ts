import { RecipeType } from "@/models/RecipeType";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeSuggestedRecipe = async (recipe: RecipeType) => {
  try {
    // Retrieve current recipes from storage
    const storedRecipes = await AsyncStorage.getItem("suggestedRecipes");
    const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

    // Add the new recipe
    const updatedRecipes = [...parsedRecipes, recipe];

    // Save back to storage
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

const clearSuggestedRecipes = async () => {
  try {
    await AsyncStorage.removeItem("suggestedRecipes");
  } catch (e) {
    console.error("Error clearing suggested recipes:", e);
  }
};

export const recipeSuggestionService = {
  storeSuggestedRecipe,
  getSuggestedRecipes,
  clearSuggestedRecipes,
};

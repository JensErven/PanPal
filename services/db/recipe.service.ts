import { FIREBASE_DB as db } from "@/firebaseConfig";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/**
 * Creates a new recipe in the database.
 *
 * @param recipeData - The data for the recipe to be created.
 * @throws Error if there is an error creating the recipe.
 */
export const createRecipe = async (recipeData: any) => {
  try {
    const recipesCollection = collection(db, "recipes");

    await addDoc(recipesCollection, recipeData);
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Failed to create recipe");
  }
};

/**
 * Retrieves a recipe from the database by its ID.
 * @param {string} recipeId - The ID of the recipe to retrieve.
 * @returns {Promise<object>} - A promise that resolves to the recipe data.
 * @throws {Error} - If the recipe is not found or if there is an error retrieving the recipe.
 */
export const getRecipeById = async (recipeId: string) => {
  try {
    const recipeDoc = doc(db, "recipes", recipeId);
    const recipeSnap = await getDoc(recipeDoc);

    if (!recipeSnap.exists()) {
      throw new Error("Recipe not found");
    }

    return recipeSnap.data();
  } catch (error) {
    console.error("Error getting recipe:", error);
    throw new Error("Failed to get recipe");
  }
};

/**
 * Updates a recipe in the database.
 *
 * @param {string} recipeId - The ID of the recipe to update.
 * @param {any} recipeData - The updated recipe data.
 * @returns {Promise<void>} - A promise that resolves when the recipe is successfully updated.
 * @throws {Error} - If there is an error updating the recipe.
 */
export const updateRecipe = async (
  recipeId: string,
  recipeData: any
): Promise<void> => {
  try {
    const recipeDoc = doc(db, "recipes", recipeId);

    await updateDoc(recipeDoc, recipeData);
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error("Failed to update recipe");
  }
};

/**
 * Deletes a recipe from the database.
 *
 * @param recipeId - The ID of the recipe to delete.
 * @throws If there is an error deleting the recipe.
 */
export const deleteRecipe = async (recipeId: string) => {
  try {
    const recipeDoc = doc(db, "recipes", recipeId);

    await deleteDoc(recipeDoc);
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw new Error("Failed to delete recipe");
  }
};

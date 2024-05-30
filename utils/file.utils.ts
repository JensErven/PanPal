import * as ImageManipulator from "expo-image-manipulator";
import { parseIngredient } from "./general.utils";
import ingredients from "../constants/ingredients.json";

/**
 * Compresses an image using ImageManipulator.
 * @param image - The image to be compressed.
 * @returns The URI of the compressed image.
 * @throws If there is an error compressing the image.
 */
export const compressImage = async (image: string) => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(image, [], {
      compress: 0.5,
    });
    return manipResult.uri;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

/**
 * Extracts the core ingredient name from a detailed ingredient string.
 * @param {string} ingredient - The detailed ingredient string.
 * @returns {string} - The core ingredient name.
 */
const extractCoreIngredient = (ingredient: string) => {
  const measurements = [
    "cup",
    "cups",
    "teaspoon",
    "teaspoons",
    "tablespoon",
    "tablespoons",
    "ounce",
    "ounces",
    "pound",
    "pounds",
    "quart",
    "quarts",
    "pint",
    "pints",
    "liter",
    "liters",
    "ml",
    "g",
    "kg",
    "lb",
    "oz",
    "fl",
    "fluid",
    "gallon",
    "gallons",
    "inch",
    "inches",
    "cm",
    "clove",
    "cloves",
    "slice",
    "slices",
    "dash",
    "pinch",
    "bunch",
    "handful",
    "whole",
    "large",
    "medium",
    "small",
    "to",
    "taste",
    "piece",
    "pieces",
    "stick",
    "sticks",
    "can",
    "cans",
    "package",
    "packages",
    "box",
    "boxes",
    "jar",
    "jars",
    "bag",
    "bags",
    "container",
    "containers",
    "degree",
    "degrees",
    "celsius",
    "fahrenheit",
    "c",
    "f",
  ];

  const coreIngredient = ingredient
    .toLowerCase()
    .split(" ")
    .filter((word: any) => !measurements.includes(word) && isNaN(Number(word)))
    .join(" ");

  return coreIngredient.trim();
};

/**
 * Gets the image URI for a given ingredient.
 * @param {string} ingredient - The ingredient name.
 * @returns {Object} - The object containing the URI of the ingredient image.
 */
export const getIngredientImage = (ingredient: string) => {
  if (!ingredient.trim()) {
    return "";
  }

  const coreIngredient = extractCoreIngredient(ingredient);

  // Exact match
  let foundIngredient = ingredients.meals.find(
    (item) => item.strIngredient.toLowerCase() === coreIngredient
  );

  // Flexible match if no exact match found
  if (!foundIngredient) {
    foundIngredient = ingredients.meals.find(
      (item) =>
        coreIngredient.includes(item.strIngredient.toLowerCase()) ||
        item.strIngredient.toLowerCase().includes(coreIngredient)
    );
  }

  if (!foundIngredient) {
    return "";
  }

  const baseUrl = "https://www.themealdb.com/images/ingredients/";
  return `${baseUrl}${foundIngredient.strIngredient}.png`;
};

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

/**
 * Parses an ingredient string into its quantity, unit, and name.
 * @param ingredient - The ingredient string to parse.
 * @returns An object containing the parsed quantity, unit, and name.
 */
export const parseIngredient = (ingredient: string) => {
  const regex = /^(\d*\.?\d+)\s?(\w+)?\s?(.*)/;
  const match = ingredient.match(regex);

  if (!match) return { quantity: 1, unit: "", name: ingredient };

  const quantity = parseFloat(match[1]);
  const unit = match[2] || "";
  const name = match[3] || "";

  return { quantity, unit, name };
};

/**
 * Updates the quantities of ingredients based on the change in servings.
 *
 * @param ingredients - An array of ingredient strings.
 * @param oldServings - The previous number of servings.
 * @param newServings - The new number of servings.
 * @returns An array of updated ingredient strings with adjusted quantities.
 */
export const updateIngredientQuantities = (
  ingredients: string[],
  oldServings: number,
  newServings: number
) => {
  return ingredients.map((ingredient: string) => {
    const { quantity, unit, name } = parseIngredient(ingredient);
    const newQuantity = (quantity / oldServings) * newServings;
    return `${newQuantity} ${unit} ${name}`.trim();
  });
};

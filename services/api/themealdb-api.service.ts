async function getIngredientImage(name: string, size?: string): Promise<any> {
  const baseUrl = `https://www.themealdb.com/`;
  const imageSize = size ? size : "Small";
  try {
    const url = `${baseUrl}images/ingredients/${name}-${imageSize}.png`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch ingredient image");
    }

    return response; // Return the response object
  } catch (error) {
    console.error(error);
    throw error;
  }
}

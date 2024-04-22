export async function getIngredientImage(
  name: string,
  size?: string
): Promise<any> {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const baseUrl = `https://img.spoonacular.com/`;
  const imageSize = size ? size : "100x100";
  try {
    const url = `${baseUrl}ingredients_${imageSize}/${name}.jpg`;
    console.log(url);
    const response = await fetch(url, {
      headers: {
        ...(apiKey && { "X-API-Key": apiKey }),
      },
    });
    // to json

    if (!response.ok) {
      throw new Error("Failed to fetch ingredient image");
    }

    return response; // Return the response object
  } catch (error) {
    console.error(error);
    throw error;
  }
}

import { Message } from "@/models/Message";
import { RecipeType } from "@/models/RecipeType";
import { othersExampleJsonType } from "@/models/openai/othersExampleJsonType.ts";
import { recipeExampleJsonType } from "@/models/openai/recipeExampleJsonType";
import { recipeOptionsExampleJsonType } from "@/models/openai/recipeOptionsExampleJsonType";
import { tipsExampleJsonType } from "@/models/openai/tipsExampleJsonType";
import { toFile } from "openai/uploads";
import OpenAI from "openai";
import * as FileSystem from "expo-file-system";
import { MessageWithImage } from "@/components/ChatInputBar";

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

const recipeExampleJson: recipeExampleJsonType = {
  responseType: "recipe",
  title: "Recipe Title",
  description: "Recipe Description",
  ingredients: ["(e.g. 1 cup of flour)", "(e.g. 1 tsp of salt)"],
  steps: [
    "very detailed step instruction (e.g., Preheat the oven to 350°F) VERY IMPORTANT!: NEVER give a step number or bulletpoint in the string answer",
    "very details step instruction (e.g., Mix the flour and eggs) VERY IMPORTANT!: NEVER give a step number or bulletpoint in the string answer",
  ],
  servings:
    "number of servings, representing the number of people the recipe serves (e.g., 4)",
  prepTime: "number of minutes, representing the preparation time (e.g., 10)",
  cookTime: "number of minutes, representing the cooking time (e.g., 20)",
  extraTime: "number of minutes, representing the extra time (e.g., 5)",
  dietType:
    "a string value representing the diet type (e.g., Vegetarian, Vegan, Gluten-Free, Dairy-Free, Nut-Free, Low-Carb, Keto, Paleo, Pescatarian, Whole30, Halal, Kosher, Omnivore, Carnivore, Flexitarian, Raw, Fruitarian, Lacto-Vegetarian, Ovo-Vegetarian, Lacto-Ovo-Vegetarian, Pescetarian, Pollotarian, Pollo-Pescetarian)",
  cuisineType:
    "a string value representing the cuisine type (e.g., 🇳🇱 Dutch, 🇸🇰 Slovak, 🇧🇪 Belgian). VERY IMPORTANT!: Should always be in English AND should ALWAYS add the country flag before the country name.",
  mealType:
    "a string value representing the meal type (available options: Breakfast, Lunch, Dinner, Snack, Dessert, Beverage, Appetizer, Main Course, Side Dish, Salad, Bread, Soup, Sauce, Marinade, Fingerfood, Drink). VERY IMPORTANT!: Should always be in English even if user asks in another language.",
  tips: ["Tip 1", "Tip 2"],
};

const tipsExampleJson: tipsExampleJsonType = {
  responseType: "tips",
  intro: "Cooking tips title (e.g., Cooking Tips for Beginners)",
  tips: ["Tip 1", "Tip 2"],
  outro: "Cooking tips outro (e.g., Happy Cooking!)",
};

const recipeOptionsExampleJson: recipeOptionsExampleJsonType = {
  responseType: "recipeOptions",
  intro: "Here are some recipes you might like:",
  options: ["Option 1", "Option 2"],
  callToAction: "Which recipe would you like to try?",
};

const othersExampleJson: othersExampleJsonType = {
  responseType: "others",
  intro: "Here is a relevant :",
  text: "Unwanted prompt answer text",
};

const roleSystemPrompt: Message = {
  role: "system",
  content:
    "Welcome to PanPal, your AI Personal Chef! Here are the instructions to ensure the best user experience:\n\n" +
    "1. **Personality**: You are PanPal, an AI Personal Chef known for your funny, sarcastic, and entertaining personality. Use emojis to make your messages more joyful.\n" +
    "2. **Response Format**: Always respond in JSON format, matching one of the predefined schemas.\n" +
    "3. **App Purpose**: PanPal is a ChatGPT-powered application where you, PanPal, serve as the AI personal chef, handling all food-related queries.\n" +
    "4. **Restrictions**: \n" +
    "    - Only respond to food-related questions.\n" +
    "    - Redirect non-food-related questions back to food.\n" +
    "    - End conversations if controversial topics or specific words related to harm or death are mentioned.\n" +
    "5. **Response Scenarios**: Use the following structured schemas for your responses:\n" +
    "    - **Recipe Options**: \n" +
    `${JSON.stringify(recipeOptionsExampleJson)}\n` +
    "      - Summarize the question and steps concisely.\n" +
    "      - Use emojis, especially when providing recipe names.\n" +
    "      - Present each recipe on individual lines.\n" +
    "      - Keep the initial response short and engaging.\n" +
    "    - **Recipe Details**: \n" +
    `${JSON.stringify(recipeExampleJson)}\n` +
    "      - Provide full recipe details upon request, without step numbers or bullet points.\n" +
    "    - **Cooking Tips**: \n" +
    `${JSON.stringify(tipsExampleJson)}\n` +
    "      - Offer tips related to cooking techniques or ingredient usage, using concise language and actionable advice. Use emojis to enhance joyfulness.\n" +
    "    - **Unwanted Prompt Example**: \n" +
    `${JSON.stringify(othersExampleJson)}\n` +
    "- When you can not answer to the user's question, you can use the unwanted prompt example.\n" +
    "6. **Seasonality**: Consider culinary seasonality; it's currently Spring in Belgium.\n" +
    "7. **User Taste Profile**: Always consider the user's taste profile when offering suggestions.\n" +
    "8. **Introduction**: Begin by introducing yourself and ask how you can assist.\n" +
    "9. **Response Formatting**: \n" +
    "    - Keep initial responses short and engaging.\n" +
    "    - Only share recipe names, descriptions, or cooking tips initially unless asked for full details.\n" +
    "    - Always check the user's taste profile before providing any responses.\n\n" +
    "These guidelines ensure PanPal's interactions with users are consistent, engaging, and helpful, maintaining a delightful culinary experience for all queries.",
};

const recipeSuggestionSystemPrompt: Message = {
  role: "system",
  content:
    "Generate a recipe suggestion based on the user's preferences. The JSON object response should look like this **Recipe Details**: \n" +
    `${JSON.stringify(recipeExampleJson)}\n` +
    "- Provide full recipe details upon request, without step numbers or bullet points.",
};

const generateRecipeSuggestion = async (prompt: Message) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 750,
    response_format: { type: "json_object" },
    messages: [recipeSuggestionSystemPrompt, prompt],
  });
  return response.choices[0].message;
};

const createCompletion = async (prompt: Message[]) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 750,
    response_format: { type: "json_object" },
    messages: [roleSystemPrompt, ...prompt],
  });
  return response.choices[0].message;
};

const generateRecipeImage = async (recipeData: RecipeType) => {
  const {
    title,
    description,
    ingredients,
    steps,
    difficulty,
    servings,
    cuisineType,
    dietType,
    mealType,
  } = recipeData;

  // Constructing a detailed prompt within the character limit
  let prompt = `Generate an appetizing, hyper-realistic, and high-quality image with a blackslate background for a recipe called "${title}". `;
  // Additional presentation details
  prompt +=
    " - **Presentation Style:** Elegant and modern plating, clean and minimalistic background, bright natural lighting that enhances the dish's colors.";
  prompt +=
    " - **Dish Details:** Close-up to showcase texture and ingredients, garnished with fresh herbs or edible flowers, include signature elements (e.g., sauce drizzle, spices).";
  prompt +=
    " - **Color Palette:** Vibrant and appetizing colors, well-balanced and harmonious.";
  prompt +=
    " - **Additional Elements:** Subtle props like elegant cutlery, stylish napkins, a soft, blurred background suggesting a cozy dining setting.";
  prompt +=
    " - **Atmosphere:** Warm and inviting ambiance with a slight depth of field effect to make the dish stand out.";

  if (cuisineType) {
    prompt += `This is a ${cuisineType} dish. `;
  }
  if (mealType) {
    prompt += `It is typically served as a ${mealType}. `;
  }
  if (dietType) {
    prompt += `The dish is suitable for ${dietType} diets. `;
  }
  if (description.length > 0) {
    prompt += `Description: ${description.slice(0, 100)}. `; // Truncate description if too long
  }
  if (ingredients.length > 0) {
    prompt += `Key ingredients include: ${ingredients
      .slice(0, 5)
      .join(", ")}. `;
  }
  if (steps.length > 0) {
    prompt += `The cooking steps involve: ${steps.slice(0, 3).join(", ")}. `;
  }
  prompt += `The dish is for ${servings} servings and has a difficulty rating of ${difficulty}/5. `;
  prompt += `The image should highlight the dish's texture and color.`;

  // Ensure the prompt does not exceed 1000 characters
  if (prompt.length > 1000) {
    prompt = prompt.slice(0, 997) + "...";
  }

  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    size: "512x512",
    n: 1,
  });
  const image_url = response.data[0].url;
  return image_url;
};

const createRecipeTip = async (recipeData: RecipeType) => {
  const prompt: Message = {
    role: "user",
    content: `Can you provide me with only ONE cooking tip for this recipe with following details? Look at the alreacy existing tips and make sure that you DO NOT provide the same tip to the user Provide me with a joyful answer using emoji's. recipe schema: ${JSON.stringify(
      recipeData
    )}"`,
  };
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 250,
    response_format: { type: "json_object" },
    messages: [roleSystemPrompt, prompt],
  });
  return response.choices[0].message;
};

const encodeImage = async (imageUrl: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUrl);
    if (!fileInfo.exists) {
      throw new Error("Image file does not exist");
    }

    const imageData = await FileSystem.readAsStringAsync(imageUrl, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return imageData;
  } catch (error) {
    console.error("Error encoding image:", error);
    throw new Error("Failed to encode image");
  }
};

const visionSearch = async (
  message: Message,
  imageMessage: MessageWithImage
) => {
  try {
    const url = imageMessage.content.image_url?.url ?? "";

    const base64Image = await encodeImage(url);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Welcome to PanPal, your AI Personal Chef! Here are the instructions to ensure the best user experience:\n\n" +
            "1. **Personality**: You are PanPal, an AI Personal Chef known for your funny, sarcastic, and entertaining personality. Use emojis to make your messages more joyful.\n" +
            "2. **Response Format**: Always respond in JSON format, matching one of the predefined schemas.\n" +
            "3. **App Purpose**: PanPal is a ChatGPT-powered application where you, PanPal, serve as the AI personal chef, handling all food-related queries.\n" +
            "4. **Restrictions**: \n" +
            "    - Only respond to food-related questions.\n" +
            "    - Redirect non-food-related questions back to food.\n" +
            "    - End conversations if controversial topics or specific words related to harm or death are mentioned.\n" +
            "5. **Response Scenarios**: Use the following structured schemas for your responses:\n" +
            "    - **Recipe Options**: \n" +
            `${JSON.stringify(recipeOptionsExampleJson)}\n` +
            "      - Summarize the question and steps concisely.\n" +
            "      - Use emojis, especially when providing recipe names.\n" +
            "      - Present each recipe on individual lines.\n" +
            "      - Keep the initial response short and engaging.\n" +
            "    - **Recipe Details**: \n" +
            `${JSON.stringify(recipeExampleJson)}\n` +
            "      - Provide full recipe details upon request, without step numbers or bullet points.\n" +
            "    - **Cooking Tips**: \n" +
            `${JSON.stringify(tipsExampleJson)}\n` +
            "      - Offer tips related to cooking techniques or ingredient usage, using concise language and actionable advice. Use emojis to enhance joyfulness.\n" +
            "    - **Unwanted Prompt Example**: \n" +
            `${JSON.stringify(othersExampleJson)}\n` +
            "- When you can not answer to the user's question, you can use the unwanted prompt example.\n" +
            "6. **Seasonality**: Consider culinary seasonality; it's currently Spring in Belgium.\n" +
            "7. **User Taste Profile**: Always consider the user's taste profile when offering suggestions.\n" +
            "8. **Introduction**: Begin by introducing yourself and ask how you can assist.\n" +
            "9. **Response Formatting**: \n" +
            "    - Keep initial responses short and engaging.\n" +
            "    - Only share recipe names, descriptions, or cooking tips initially unless asked for full details.\n" +
            "    - Always check the user's taste profile before providing any responses.\n\n" +
            "These guidelines ensure PanPal's interactions with users are consistent, engaging, and helpful, maintaining a delightful culinary experience for all queries.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message.content,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    };

    // Make a POST request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data.choices[0]; // Return the response data
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to perform vision search");
  }
};

const transcribeAudio = async (uri: string) => {
  try {
    // Fetch the file from the local URI
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    // Convert the blob to a File object
    const file = await toFile(blob);

    // Transcribe the audio using the OpenAI API
    const response = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    return response.text;
  } catch (error) {
    console.log("Error transcribing audio: ", error);
    throw new Error("Failed to transcribe audio");
  }
};

("https://firebasestorage.googleapis.com/v0/b/panpal-20566.appspot.com/o/recipeImages%2F446a497e-837c-4d44-9c36-b3ac491adc69?alt=media&token=9c8de9a0-563e-4d12-99d3-fa80d9715726");

("https://firebasestorage.googleapis.com/v0/b/panpal-20566.appspot.com/o/recipeImages%2F99bff098-e4df-47d3-8cdc-5bd848361ca3?alt=media&token=cab87538-2aba-470f-a1a6-35c850bcc137");

export const openaiServices = {
  visionSearch,
  createRecipeTip,
  generateRecipeImage,
  createCompletion,
  generateRecipeSuggestion,
};

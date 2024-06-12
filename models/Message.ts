import { recipeExampleJsonType } from "./openai/recipeExampleJsonType";
import { recipeOptionsExampleJsonType } from "./openai/recipeOptionsExampleJsonType";
import { tipsExampleJsonType } from "./openai/tipsExampleJsonType";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  imageUrl?: string;
};

import { message } from "@/models/message";
import OpenAI from "openai";
import { MessageContent } from "openai/resources/beta/threads/messages";
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const ASSISTANT_ID = "asst_VD8RtI0Vr8e9AjZ8CtgIzMvQ";
const openai = new OpenAI({ apiKey });

const fetchPanPalResponse = async (message: string): Promise<message> => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "👋 Hello! I'm PanPal, your helpful cooking assistant! I'm here to create delicious recipes and provide helpful tips for all your cooking needs. Let's get started! You always give a response as a json object. 🍳🥘",
      },
      { role: "user", content: message },
    ],

    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0].message.content?.toString();

  const newMessage: message = { message: response!, role: "panpal" };
  return newMessage;
};

// const createAssistant = async () => {
//   const assistant = await openai.beta.assistants.create({
//     name: "PanPal",
//     instructions:
//       "Test Test Test. I'm here to create delicious recipes and provide helpful tips for all your cooking needs. Let's get started! 🍳🥘",
//     model: "gpt-3.5-turbo-0125",
//   });
//   return assistant.id;
// };

/**
 * Creates a new thread using the openai.beta.threads.create() method.
 * @returns A Promise that resolves to the ID of the newly created thread.
 */
async function createThread(): Promise<string> {
  console.log("Creating a new thread...");
  const newThread = await openai.beta.threads.create();
  console.log("Thread created!");
  return newThread.id;
}

/**
 * Submits a message to a thread.
 *
 * @param threadId - The ID of the thread.
 * @param message - The message to submit.
 * @returns A Promise that resolves to the ID of the new message.
 */
async function submitMessageToThread(
  threadId: string,
  message: string
): Promise<string> {
  console.log("Submitting a message to the thread...");
  const newMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
  console.log("Message submitted!");
  return newMessage.id;
}

// run the assistant
async function runAssistant(threadId: string): Promise<message[]> {
  console.log("Running the assistant...");
  let run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID,
    instructions:
      "I'm here to create delicious recipes and provide helpful tips for all your cooking needs. Let's get started! 🍳🥘",
  });

  // check the state of the run
  while (run.status !== "completed") {
    console.log("Run not completed. Waiting...");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
    run = await openai.beta.threads.runs.retrieve(threadId, run.id);
  }

  console.log("Run completed!");
  const messages = await openai.beta.threads.messages.list(threadId);
  const newMessages = messages.data.map((message) => {
    const newMessage: message = {
      message: message.content[0].text.value,
      id: message.id,
      role: message.role,
    };
    return newMessage;
  });
  console.log("Messages retrieved!");
  // revert the list to show the latest message first
  newMessages.reverse();

  return newMessages;
}

export {
  fetchPanPalResponse,
  createThread,
  runAssistant,
  submitMessageToThread,
};

// create model for message
export interface message {
  id: string;
  message: string;
  role: "user" | "panpal" | "assistant";
}

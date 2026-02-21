import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type AIProvider = "chatgpt" | "gemini" | "claude";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const AUTONOMY_INSTRUCTIONS: Record<number, string> = {
  1: "Follow the user instructions exactly. Do not add any extra information or suggestions.",
  2: "Follow the instructions closely, but you may add minor clarifications if needed.",
  3: "Balance following instructions with providing helpful additional insights where appropriate.",
  4: "Take initiative to provide comprehensive analysis and suggestions beyond the basic request.",
  5: "Act independently to provide the most thorough and creative response possible.",
};

export async function callAI(
  provider: AIProvider,
  prompt: string,
  autonomyLevel: number = 3
): Promise<string> {
  const autonomyInstruction = AUTONOMY_INSTRUCTIONS[autonomyLevel] || AUTONOMY_INSTRUCTIONS[3];
  const fullPrompt = `${autonomyInstruction}\n\n${prompt}`;

  switch (provider) {
    case "chatgpt":
      return callChatGPT(fullPrompt);
    case "gemini":
      return callGemini(fullPrompt);
    case "claude":
      return callClaude(fullPrompt);
    default:
      return callChatGPT(fullPrompt);
  }
}

async function callChatGPT(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || "";
}

async function callGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callClaude(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });
  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }
  return "";
}

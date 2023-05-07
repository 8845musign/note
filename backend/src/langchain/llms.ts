import { OpenAI } from 'langchain/llms/openai';

export const getLlms = (openAIApiKey: string) => {
  return new OpenAI({ temperature: 0.5, openAIApiKey });
};

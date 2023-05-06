import { NextResponse, NextRequest } from 'next/server';
import { Configuration, OpenAIApi } from "openai";
import { extractKeyword } from "@/features/langchain";

// 発行したAPI Keyを使って設定を定義
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  if (!configuration.apiKey) {
    console.log('OpenAI API key not configured, please follow instructions in README.md');
    return new Response(null, {
      status: 500,
      statusText: 'OpenAI API key not configured, please follow instructions in README.md',
    })
  }

  console.log('call');

  // Bodyを取得
  const body = await req.json();

  console.log(body);

  try {
    // 設定を諸々のせてAPIとやり取り
    const keywords = await extractKeyword(body.url);

    return NextResponse.json({ result: keywords })
  } catch (error: any) {
    if (error.response) {
      console.error(`${error.response.status}: ${error.response.data}`);

      return new Response(null, {
        status: error.response.status,
        statusText: error.response.data,
      })
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);

      return new Response(null, {
        status: 500,
        statusText: 'An error occurred during your request.',
      })
    }
  }
}

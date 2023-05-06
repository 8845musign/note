import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { model } from './model';
import { CharacterTextSplitter } from "langchain/text_splitter";
import { loadQAStuffChain } from "langchain/chains";
import { extractKeyword as promptExtractKeyword } from './prompts'

import { Page, Browser } from "puppeteer";

// import { extractKeyword as promptExtractKeyword } from "./prompts";

const spliter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
});


const loadUrl = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        gotoOptions: {
            waitUntil: "networkidle0"
        },
        async evaluate(page: Page, browser: Browser) {
            return await page.evaluate(() => document.body.innerText);
        }
    });

    return await loader.load();
}

export const extractKeyword = async (url: string): Promise<string[]> => {
    const docs = await loadUrl(url);
    const docOutput = await spliter.splitDocuments([
        docs[0]
    ])

    const chainA = loadQAStuffChain(model);
    const res = await chainA.call(
        {
            input_documents: docOutput,
            question: promptExtractKeyword,
        }
    )

    const text = res.text as string;

// const text = `
// Retrieval
// VectorDB
// Retriever
// VectorStore
// VectorStoreRetriever
// get_relevant_documents
// query
// str
// metadata
// filtering
// similarity
// maximal marginal relevance
// embeddings
// vectorstores
// ChatGPT
// Retrieval Plugin
// OpenAI
// ConversationalRetrievalChain
// ChatVectorDBChain
// memory
// Chat
// LangChain
// RetrievalQA
// VectorDBQA
// langchain/retrievers
// question-answering
// callbacks
// logging
// tracing
// streaming output
// third-party integrations
// concurrent runs
// independent callbacks
// deeply nested trees
// callback handlers
// scoped to a single request`
    
    // 行ごとに分割し、空行を削除
    const lines = text.split("\n").filter((line) => line.length > 0);

    return lines;
}

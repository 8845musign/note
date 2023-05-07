import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getLlms } from './llms';
import { BaseLanguageModel } from 'langchain/base_language';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { loadQAStuffChain } from 'langchain/chains';
import { extractKeyword as promptExtractKeyword } from './prompts';
import { Page, Browser } from 'puppeteer';

const spliter = new CharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 100,
});

const loadUrl = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    gotoOptions: {
      waitUntil: 'networkidle0',
    },
    async evaluate(page: Page, browser: Browser) {
      const articleText = await page.evaluate(() => {
        const articleElement = document.querySelector('article');
        if (articleElement) {
          return articleElement.innerText;
        } else {
          return '';
        }
      });

      return articleText;
    },
  });

  return await loader.load();
};

@Injectable()
export class LangchainService {
  private model: BaseLanguageModel;
  constructor(private configService: ConfigService) {
    this.model = getLlms(this.configService.get('OPENAI_API_KEY'));
  }

  async extractKeywords(url: string) {
    const docs = await loadUrl(url);

    const docOutput = await spliter.splitDocuments([docs[0]]);

    const chainA = loadQAStuffChain(this.model);
    const res = await chainA.call({
      input_documents: docOutput,
      question: promptExtractKeyword,
    });

    const text = res.text as string;

    const lines = text.split('\n').filter((line) => line.length > 0);

    return lines;
  }
}

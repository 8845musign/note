import { Controller, Post, Body } from '@nestjs/common';
import { LangchainService } from './langchain.service';

@Controller('langchain')
export class LangchainController {
  constructor(private langchainService: LangchainService) {}
  @Post('extractKeywords')
  async postExtractKeywords(@Body() data: { url: string }) {
    const res = await this.langchainService.extractKeywords(data.url);
    return res;
  }
}

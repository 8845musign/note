import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LangchainController } from './langchain/langchain.controller';
import { AppService } from './app.service';
import { LangchainService } from './langchain/langchain.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, LangchainController],
  providers: [AppService, LangchainService],
})
export class AppModule {}

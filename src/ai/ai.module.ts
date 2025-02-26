import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptModule } from './prompt/prompt.module';
import { ChatGptProvider } from './providers/chatGpt.provider';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PromptModule],
  providers: [
    {
      provide: 'IAIProvider',
      useClass: ChatGptProvider,
    },
    AiService,
  ],
  exports: [AiService],
})
export class AiModule {}

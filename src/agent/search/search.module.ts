import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';

@Module({
  imports: [AiModule, PromptModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}

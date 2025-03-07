import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { PromptService } from 'src/ai/prompt/prompt.service';

@Module({
  imports: [AiModule, PromptModule],
  providers: [RoutingService, PromptService],
  exports: [RoutingService],
})
export class RoutingModule {}

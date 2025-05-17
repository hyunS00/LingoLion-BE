import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';

@Module({
  imports: [AiModule, PromptModule],
  providers: [RoutingService],
  exports: [RoutingService],
})
export class RoutingModule {}

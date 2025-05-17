import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { RoutingModule } from './routing/routing.module';
import { SearchModule } from './search/search.module';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { ContextManagerModule } from './context-manager/context-manager.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    RoutingModule,
    SearchModule,
    AiModule,
    PromptModule,
    SearchModule,
    ContextManagerModule,
    FeedbackModule,
  ],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}

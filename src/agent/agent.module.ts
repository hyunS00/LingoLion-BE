import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { RoutingModule } from './routing/routing.module';
import { SearchModule } from './search/search.module';
import { AiModule } from 'src/ai/ai.module';
import { RoutingService } from './routing/routing.service';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { SearchService } from './search/search.service';
import { ContextManagerModule } from './context-manager/context-manager.module';
import { ContextManagerService } from './context-manager/context-manager.service';
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

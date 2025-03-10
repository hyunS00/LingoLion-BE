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

@Module({
  imports: [
    RoutingModule,
    SearchModule,
    AiModule,
    PromptModule,
    SearchModule,
    ContextManagerModule,
  ],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}

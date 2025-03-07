import { Injectable } from '@nestjs/common';
import { RoutingService } from './routing/routing.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly routingService: RoutingService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
  ) {}

  async processMessage(request: AiRequestDto) {
    const tasks = await this.routingService.getRoutingDecision(request);
    console.log('routing: ', tasks);

    if (tasks.route === 'detect') {
      return {
        status: 'detect',
        reason: tasks.reason,
      };
    }

    if (tasks.route === 'search') {
      /* 검색 로직 */
      console.log('search result:');
    }

    const prompt = this.promptService.buildSituationPrompt(
      request.context.situation,
    );

    console.log('ask:', prompt);

    const response = this.aiService.askWithContext(
      prompt,
      request.context.history,
    );
    return { status: 'done', data: response };
  }
}

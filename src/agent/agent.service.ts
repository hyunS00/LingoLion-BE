import { Injectable, Logger } from '@nestjs/common';
import { RoutingService } from './routing/routing.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { SearchService } from './search/search.service';
import { ContextManagerService } from './context-manager/context-manager.service';
import { Sender } from 'src/conversations/entities/message.entity';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name, { timestamp: true });
  constructor(
    private readonly routingService: RoutingService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    private readonly searchService: SearchService,
    private readonly contextManager: ContextManagerService,
  ) {}

  async processMessage(request: AiRequestDto) {
    this.logger.log(`컨텍스트 조회: ${request}`);
    const context = await this.contextManager.getConversationContext(
      request.conversationId,
      request.userId,
    );

    this.logger.log(`의도분석: ${request} 컨텍스트:${context}`);
    const tasks = await this.routingService.getRoutingDecision(
      request.content,
      context,
    );

    if (tasks.route === 'reject') {
      this.logger.log(
        `REJECT-> 의도분석: ${request} 컨텍스트:${context} 의도: ${tasks}`,
      );
      return {
        status: 'reject',
        reason: tasks.reason,
      };
    }

    if (tasks.route === 'search') {
      this.logger.log(
        `search-> 검색 필요 의도분석: ${request} 컨텍스트:${context} 의도: ${tasks}`,
      );
      const searchResults = await this.searchService.aggregate(
        request.content,
        context,
      );

      context.relatedInfo = searchResults;
      this.logger.log(`검색 결과 -> 컨텍스트:${context}`);
    }

    // handlebars 템플릿 동적 처리
    const prompt = this.promptService.buildSituationPrompt({
      content: request.content,
      context,
    });
    this.logger.log(`응답 요청 ->  ${request} 컨텍스트:${context}`);
    const response = await this.aiService.ask(prompt);
    this.logger.log(`응답 결과 -> ${response}`);
    context.messages.push(
      { role: Sender.user, content: request.content },
      {
        role: response.role as Sender,
        content: response.content,
      },
    );
    this.logger.log(`응답 컨텍스트 반영 -> ${request} 컨텍스트:${context}`);
    this.contextManager.saveContext(request.conversationId, context);
    return { status: 'done', data: response };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { RoutingService } from './routing/routing.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { SearchService } from './search/search.service';
import { ContextManagerService } from './context-manager/context-manager.service';
import { Sender } from 'src/conversations/entities/message.entity';
import { FeedbackService } from './feedback/feedback.service';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name, { timestamp: true });
  constructor(
    private readonly routingService: RoutingService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    private readonly searchService: SearchService,
    private readonly feedbackService: FeedbackService,
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

    // if (tasks.route === 'search') {
    //   this.logger.log(
    //     `search-> 검색 필요 의도분석: ${request} 컨텍스트:${context} 의도: ${tasks}`,
    //   );
    //   const searchResults = await this.searchService.aggregate(
    //     request.content,
    //     context,
    //   );

    //   context.relatedInfo = searchResults;
    //   this.logger.log(`검색 결과 -> 컨텍스트:${context}`);
    // }

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

  async processMessageStream(request: AiRequestDto) {
    const context = await this.contextManager.getConversationContext(
      request.conversationId,
      request.userId,
    );

    const tasks = await this.routingService.getRoutingDecision(
      request.content,
      context,
    );

    // reject인 경우, 단일 스트림으로 거절 메시지 전송
    if (tasks.route === 'reject') {
      async function* rejectStream() {
        yield {
          role: 'assistant',
          content: tasks.reason ?? '죄송합니다. 대화를 진행할 수 없습니다.',
          refusal: true,
        };
      }
      return rejectStream();
    }

    // 검색인 경우, 관련 정보를 context에 반영
    // if (tasks.route === 'search') {
    //   const searchResults = await this.searchService.aggregate(
    //     request.content,
    //     context,
    //   );
    //   context.relatedInfo = searchResults;
    // }

    await this.feedbackService.getFeedback(request, context);

    const prompt = this.promptService.buildSituationPrompt({
      content: request.content,
      context,
    });

    // GPT 응답 스트림 받기
    const stream = await this.aiService.askStream(prompt);

    // 상위 this 캡처
    const self = this;

    // 스트림 전체 조각을 모아서 context에 저장하는 래퍼 스트림
    async function* wrappedStream() {
      const fullChunks: string[] = [];
      for await (const chunk of stream) {
        fullChunks.push(chunk.content);
        yield chunk; // 클라이언트에 실시간 전송
      }

      // 스트림 종료 후 전체 메시지를 context에 저장
      context.messages.push(
        { role: Sender.user, content: request.content },
        { role: Sender.assistant, content: fullChunks.join('') },
      );

      self.contextManager.saveContext(request.conversationId, context);
      self.logger.log(`응답 컨텍스트 반영 완료`);
    }

    return wrappedStream();
  }
}

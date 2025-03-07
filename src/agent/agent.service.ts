import { Injectable } from '@nestjs/common';
import { RoutingService } from './routing/routing.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { SearchService } from './search/search.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly routingService: RoutingService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    private readonly searchService: SearchService,
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
      const searchResults = await this.searchService.aggregate(request.content);
      console.log('검색 결과 수집:', searchResults.resultCount || '결과 없음');

      // 중요: 검색 결과를 request.context에 추가
      request.context.searchResults = searchResults;

      // 템플릿에서 사용할 검색 내용 형식화
      request.context.searchContent = searchResults.results
        .map((result, index) => ({
          index: index + 1,
          title: result.title,
          content: result.content,
          url: result.url,
        }))
        .slice(0, 3); // 상위 3개 결과만 사용
    }

    // handlebars 템플릿 동적 처리
    const prompt = this.promptService.buildSituationPrompt(request.context);

    console.log('ask:', prompt);

    const response = this.aiService.askWithContext(
      prompt,
      request.context.history,
    );
    return { status: 'done', data: response };
  }
}

import { Injectable } from '@nestjs/common';
import { RoutingService } from './routing/routing.service';
import { AiRequestDto } from './dto/ai-request.dto';

@Injectable()
export class AgentService {
  constructor(private readonly routingService: RoutingService) {}

  async processMessage(request: AiRequestDto) {
    const tasks = await this.routingService.getRoutingDecision(request);

    if (tasks.route === 'detect') {
      return {
        message: '회화와 관련된 이야기만 해주세요',
        reason: tasks.reason,
      };
    }

    if (tasks.route === 'search') {
      /* 검색 로직 */
    }

    return tasks;
  }
}

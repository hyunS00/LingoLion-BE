import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';
import { AiRequestDto } from '../dto/ai-request.dto';

@Injectable()
export class RoutingService {
  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
  ) {}
  async getRoutingDecision(request: AiRequestDto) {
    const context = {
      date: Date.now().toLocaleString(),
      content: request.content,
      ...request.context,
    };
    const prompt = this.promptService.buildAgentPrompt('routing', context);

    const response = await this.aiService.ask(prompt);

    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }
}

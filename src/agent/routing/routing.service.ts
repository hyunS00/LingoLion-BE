import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { Context } from '../context-manager/dto/context.interface';

@Injectable()
export class RoutingService {
  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
  ) {}
  async getRoutingDecision(content: string, context: Context) {
    const prompt = this.promptService.buildAgentPrompt('routing', {
      content,
      context,
    });

    const response = await this.aiService.ask(prompt);
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }
}

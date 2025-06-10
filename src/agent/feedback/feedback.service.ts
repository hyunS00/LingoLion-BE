import { Inject, Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { Context } from '../context-manager/dto/context.interface';
import { IFeedbackRepository } from 'src/feedback/repositories/feedback.repository.interface';
import { AiRequestDto } from '../dto/ai-request.dto';
import { plainToInstance } from 'class-transformer';
import { DetailedFeedback } from 'src/feedback/entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    @Inject('IFeedbackRepository')
    private readonly feedbackRepository: IFeedbackRepository,
  ) {}

  async getFeedback(request: AiRequestDto, context: Context) {
    const prompt = this.promptService.buildAgentPrompt('feedback', {
      content: request.content,
      context,
    });

    const response = await this.aiService.ask(prompt);

    const parsedResponse = JSON.parse(response.content);

    const detailedFeedback = plainToInstance(DetailedFeedback, parsedResponse);

    await this.feedbackRepository.save(
      { id: request.userId },
      {
        conversationId: request.conversationId,
        detailedFeedback,
      },
      request.content,
    );
  }
}

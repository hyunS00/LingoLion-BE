import { Inject, Injectable } from '@nestjs/common';
import { ChatCompletionMessage, IAIProvider } from './providers/ai.interface';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';

@Injectable()
export class AiService {
  constructor(
    @Inject('IAIProvider') private readonly aiProvider: IAIProvider,
  ) {}

  async ask(prompt: string, model: string): Promise<ChatCompletionMessage> {
    return await this.aiProvider.generateResponse(prompt, model);
  }

  async askWithContext(
    prompt: string,
    model: string,
    context: CreateMessageDto[],
  ): Promise<ChatCompletionMessage> {
    return await this.aiProvider.generateResponseWithContext(
      prompt,
      model,
      context,
    );
  }
}

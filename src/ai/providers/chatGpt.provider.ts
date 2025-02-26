import { ConfigService } from '@nestjs/config';
import { IAIProvider } from './ai.interface';
import OpenAI from 'openai';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ChatCompletionMessage } from 'openai/resources';

@Injectable()
export class ChatGptProvider implements IAIProvider {
  private openAI: OpenAI;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(
      'OPENAI_API_CONVERSATION_KEY',
    );

    this.openAI = new OpenAI({
      apiKey,
    });
  }

  async createChatCompletion(
    prompt: string,
    model: string,
    messages?: CreateMessageDto[],
  ) {
    try {
      const completion = await this.openAI.chat.completions.create({
        messages: [
          {
            role: 'developer',
            content: prompt,
          },
          ...(messages || []),
        ],
        model,
      });
      return completion.choices[0].message;
    } catch (e) {
      throw new ServiceUnavailableException(
        '추천 서비스를 일시적으로 사용할 수 없습니다.',
      );
    }
  }

  async generateResponse(
    prompt: string,
    model: string,
  ): Promise<ChatCompletionMessage> {
    return await this.createChatCompletion(prompt, model);
  }

  async generateResponseWithContext(
    prompt: string,
    model: string,
    messages: CreateMessageDto[],
  ): Promise<ChatCompletionMessage> {
    return this.createChatCompletion(prompt, model, messages);
  }
}

import { ConfigService } from '@nestjs/config';
import { ChatCompletionMessage, IAIProvider } from './ai.interface';
import OpenAI from 'openai';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

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
    model: string = 'gpt-4o-mini',
    messages?: CreateMessageDto[],
  ) {
    try {
      const completion = await this.openAI.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          ...(messages || []),
        ],
        model,
      });

      const message: ChatCompletionMessage = {
        content: completion.choices[0].message.content,
        role: completion.choices[0].message.role,
      };

      return message;
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(
        'AI 서비스를 일시적으로 사용할 수 없습니다.',
      );
    }
  }

  async generateResponse(
    prompt: string,
    model: string = 'gpt-4o-mini',
  ): Promise<ChatCompletionMessage> {
    return await this.createChatCompletion(prompt, model);
  }

  async generateResponseWithContext(
    prompt: string,
    model: string = 'gpt-4o-mini',
    messages: CreateMessageDto[],
  ): Promise<ChatCompletionMessage> {
    return this.createChatCompletion(prompt, model, messages);
  }

  async generateStreamResponse(
    prompt: string,
    model: string = 'gpt-4o-mini',
    messages: CreateMessageDto[] = [],
  ): Promise<AsyncIterable<ChatCompletionMessage>> {
    try {
      const stream = await this.openAI.chat.completions.create({
        model,
        stream: true,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          ...messages,
        ],
      });

      const asyncIterable = {
        async *[Symbol.asyncIterator]() {
          for await (const chunk of stream as any) {
            const delta = chunk.choices?.[0]?.delta;
            if (!delta) continue;

            yield {
              content: delta.content || '',
              role: delta.role || 'assistant',
            };
          }
        },
      };

      return asyncIterable;
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(
        'AI 스트리밍 서비스를 일시적으로 사용할 수 없습니다.',
      );
    }
  }
}

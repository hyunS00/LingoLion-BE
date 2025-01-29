import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(
      'OPENAI_API_CONVERSATION_KEY',
    );

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async test(messages: CreateMessageDto[]) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'developer',
          content: `마트에서 과일을 사야되는 상황을 가정하고 회화연습을 도와줘 난이도는 쉽게해줘 틀린부분이 있다면 문장 끝에 알려줘
            `,
        },
        ...messages,
      ],
      model: 'gpt-4o-mini',
    });

    return completion.choices[0].message;
  }
}

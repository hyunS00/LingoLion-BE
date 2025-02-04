import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';
import { SituationDto } from 'src/conversations/dto/situation.dto';
import { GetRecommendationsDto } from 'src/recommendations/dto/get-recommendation.dto';

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

  async createChatCompletion(
    prompt: string,
    model: string,
    messages?: CreateMessageDto[],
  ) {
    try {
      const completion = await this.openai.chat.completions.create({
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

  async simulateConversationPractice(
    messages: CreateMessageDto[],
    situationDto: SituationDto,
  ) {
    const { place, aiRole, userRole, goal } = situationDto;
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'developer',
          content: `${place}에서 AI와 함께 영어회화를 진행합니다.
          당신의 역할은 ${aiRole}입니다.
          제가 맡을 역할은 ${userRole}입니다.
          대화의 목표는 ${global}입니다.
          문맥에 맞게 회화를 진행해주세요`,
        },
        ...messages,
      ],
      model: 'gpt-4o-mini',
    });

    return completion.choices[0].message;
  }

  async recommendPlace() {
    const prompt = `
            영어회화를 하기위한 장소를 4가지 추천해주세요 장소만 작성해주세요
            예시: 은행,카페,레스토랑,공원
            `;
    const message = this.createChatCompletion(
      prompt,
      this.configService.get<string>('OPENAI_API_MODEL'),
    );

    return message;
  }

  async recommendAiRole(getRecommendations: GetRecommendationsDto) {
    const { place } = getRecommendations;
    const prompt = `
            ${place}에서 영어회화를 하기위해 AI에게 부여할 역할 4가지를 추천해주세요
            ***반드시 역할만 답변해주세요***
            답변 예시: 은행원,경비원,관광객,종업원
            `;
    const message = this.createChatCompletion(
      prompt,
      this.configService.get<string>('OPENAI_API_MODEL'),
    );
    return message;
  }

  async recommendUserRole(getRecommendations: GetRecommendationsDto) {
    const { place, aiRole } = getRecommendations;
    const prompt = `
            ${place}에서 AI와 함께 영어회화를 진행합니다. AI의 역할은 ${aiRole}입니다. 제가 맡을 역할 4가지를 추천해주세요
            출력 예시: 은행원,경비원,관광객,종업원
            `;
    const message = this.createChatCompletion(
      prompt,
      this.configService.get<string>('OPENAI_API_MODEL'),
    );
    return message;
  }

  async recommendGoal(getRecommendations: GetRecommendationsDto) {
    const { place, aiRole, userRole } = getRecommendations;
    const prompt = `
            ${place}에서 AI와 함께 영어회화를 진행합니다. AI의 역할은 ${aiRole}입니다. 제가 맡을 역할은 ${userRole}입니다.
            이 회화에서 진행할 상황 4가지 추천해주세요
  
            출력 예시: 주문을 한다, 여권을 잃어버림, 길을 묻는다, 물어본다
            `;
    const message = this.createChatCompletion(
      prompt,
      this.configService.get<string>('OPENAI_API_MODEL'),
    );
    return message;
  }
}

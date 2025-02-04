import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';
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

  async recommendPlace() {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'developer',
            content: `
            영어회화를 하기위한 장소를 4가지 추천해주세요 장소만 작성해주세요
            예시: 은행,카페,레스토랑,공원
            `,
          },
        ],
        model: 'gpt-4o-mini',
      });
      return completion.choices[0].message;
    } catch (e) {
      throw e;
    }
  }

  async recommendAiRole(getRecommendations: GetRecommendationsDto) {
    const { place } = getRecommendations;
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'developer',
            content: `
            ${place}에서 영어회화를 하기위해 AI에게 부여할 역할 4가지를 추천해주세요
            *** 반드시 역할만 답변해주세요 ***
            답변 예시: 은행원,경비원,관광객,종업원
            `,
          },
        ],
        model: 'gpt-4o-mini',
      });
      return completion.choices[0].message;
    } catch (e) {
      throw e;
    }
  }

  async recommendUserRole(getRecommendations: GetRecommendationsDto) {
    const { place, aiRole } = getRecommendations;

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'developer',
            content: `
            ${place}에서 AI와 함께 영어회화를 진행합니다. AI의 역할은 ${aiRole}입니다. 제가 맡을 역할 4가지를 추천해주세요
            출력 예시: 은행원,경비원,관광객,종업원
            `,
          },
        ],
        model: 'gpt-4o-mini',
      });
      return completion.choices[0].message;
    } catch (e) {
      throw e;
    }
  }

  async recommendGoal(getRecommendations: GetRecommendationsDto) {
    const { place, aiRole, userRole } = getRecommendations;

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'developer',
            content: `
            ${place}에서 AI와 함께 영어회화를 진행합니다. AI의 역할은 ${aiRole}입니다. 제가 맡을 역할은 ${userRole}입니다.
            이 회화에서 진행할 상황 4가지 추천해주세요
  
            출력 예시: 주문을 한다, 여권을 잃어버림, 길을 묻는다, 물어본다
            `,
          },
        ],
        model: 'gpt-4o-mini',
      });
      return completion.choices[0].message;
    } catch (e) {
      throw e;
    }
  }
}

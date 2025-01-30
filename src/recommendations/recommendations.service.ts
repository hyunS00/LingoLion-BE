import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GetRecommendationsDto } from './dto/get-recommendation.dto';
import { RecommendType } from './entities/recommendation.entity';
import { OpenAIService } from 'src/openAI/openAI.service';
import { ChatCompletionMessage } from 'openai/resources';

@Injectable()
export class RecommendationsService {
  constructor(private readonly openAIService: OpenAIService) {}

  private readonly recommendationMap: Record<
    RecommendType,
    (dto: GetRecommendationsDto) => Promise<ChatCompletionMessage>
  > = {
    [RecommendType.Place]: () => this.openAIService.recommendPlace(),
    [RecommendType.AiRole]: (dto) => this.openAIService.recommendAiRole(dto),
    [RecommendType.UserRole]: (dto) =>
      this.openAIService.recommendUserRole(dto),
    [RecommendType.Goal]: (dto) => this.openAIService.recommendGoal(dto),
  };

  async getRecommendations(
    type: RecommendType,
    getRecommendationDto: GetRecommendationsDto,
  ) {
    const recommendFunction = this.recommendationMap[type];
    if (!recommendFunction) {
      throw new BadRequestException(
        `Invalid recommendation type: [${type}]. Valid types are: ${Object.values(RecommendType).join(', ')}. DTO: ${JSON.stringify(getRecommendationDto)}`,
      );
    }

    let data: ChatCompletionMessage;

    try {
      data = await recommendFunction(getRecommendationDto);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new ServiceUnavailableException(
        '추천 서비스가 현재 사용할 수 없습니다.',
      );
    }

    return { type, data };
  }
}

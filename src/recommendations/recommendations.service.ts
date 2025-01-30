import { BadRequestException, Injectable } from '@nestjs/common';
import { GetRecommendationsDto } from './dto/get-recommendation.dto';
import { Repository } from 'typeorm';
import {
  Recommendation,
  RecommendType,
} from './entities/recommendation.entity';
import { OpenAIService } from 'src/openAI/openAI.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatCompletionMessage } from 'openai/resources';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    private readonly openAIService: OpenAIService,
  ) {}
  async getRecommendations(
    type: RecommendType,
    getRecommendations: GetRecommendationsDto,
  ) {
    let data: ChatCompletionMessage;
    if (type === RecommendType.Place) {
      data = await this.openAIService.recommendPlace();
    } else if (type === RecommendType.AiRole) {
      data = await this.openAIService.recommendAiRole(getRecommendations);
    } else if (type === RecommendType.UserRole) {
      data = await this.openAIService.recommendUserRole(getRecommendations);
    } else if (type === RecommendType.Goal) {
      data = await this.openAIService.recommendGoal(getRecommendations);
    } else {
      throw new BadRequestException(
        `해당하는 타입이 없습니다 [${type}] ${getRecommendations}`,
      );
    }

    return { type, data };
  }
}

import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SituationRecommendDto } from './dto/situation-recommend.dto';
import { SituationType } from './entities/situation.entity';
import { OpenAIService } from 'src/openAI/openAI.service';
import { ChatCompletionMessage } from 'openai/resources';

@Injectable()
export class SituationsService {
  constructor(private readonly openAIService: OpenAIService) {}

  private readonly recommendationFuncMap: Record<
    SituationType,
    (dto: SituationRecommendDto) => Promise<ChatCompletionMessage>
  > = {
    [SituationType.Place]: () => this.openAIService.recommendPlace(),
    [SituationType.AiRole]: (dto) => this.openAIService.recommendAiRole(dto),
    [SituationType.UserRole]: (dto) =>
      this.openAIService.recommendUserRole(dto),
    [SituationType.Goal]: (dto) => this.openAIService.recommendGoal(dto),
  };

  async getSituationsRecommed(situationRecommendDto: SituationRecommendDto) {
    const { type } = situationRecommendDto;
    const recommendFunction = this.recommendationFuncMap[type];
    if (!recommendFunction) {
      throw new BadRequestException(
        `Invalid recommendation type: [${type}]. Valid types are: ${Object.values(SituationType).join(', ')}`,
      );
    }

    const data = await recommendFunction(situationRecommendDto);

    return { type, data };
  }
}

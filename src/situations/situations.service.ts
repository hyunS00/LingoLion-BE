import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SituationRecommendDto } from './dto/situation-recommend.dto';
import { SituationType } from './entities/situation.entity';
import { ChatCompletionMessage } from 'openai/resources';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class SituationsService {
  constructor(private readonly aiService: AiService) {}

  async recommend(situationRecommendDto: SituationRecommendDto) {
    const { type } = situationRecommendDto;
    /* 타입에 맞는 템플릿 생성 예정 */
    const template = `${type} 추천해줘`;
    /* 사용자가 원하는 모델 선택 예정 */
    const model = 'gpt-4o-mini';
    const data = await this.aiService.ask(template, model);
    return { type, data };
  }
}

import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SituationRecommendDto } from './dto/situation-recommend.dto';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { CreateSituationDto } from './dto/create-situation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Situation } from './entities/situation.entity';

@Injectable()
export class SituationsService {
  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    @InjectRepository(Situation)
    private readonly situationRepository: Repository<Situation>,
  ) {}

  async recommend(situationRecommendDto: SituationRecommendDto) {
    const { type } = situationRecommendDto;

    /* 타입에 맞는 템플릿 생성 예정 */
    const template = this.promptService.buildRecommendationPrompt(
      situationRecommendDto,
    );
    console.log(template);

    /* 사용자가 원하는 모델 선택 예정 */
    const model = 'gpt-4o-mini';
    const data = await this.aiService.ask(template, model);
    return { type, data };
  }

  async create(createSituationDto: CreateSituationDto) {
    const sidtuation = await this.situationRepository.save(createSituationDto);
    return sidtuation.id;
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { SituationRecommendDto } from './dto/situation-recommend.dto';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { CreateSituationDto } from './dto/create-situation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Situation } from './entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateSituationDto } from './dto/update-situation.dto';

@Injectable()
export class SituationsService {
  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    @InjectRepository(Situation)
    private readonly situationRepository: Repository<Situation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async create(createSituationDto: CreateSituationDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const situation = await this.situationRepository.save({
      ...createSituationDto,
      user,
    });

    return situation.id;
  }

  async findById(id: number) {
    const situation = await this.situationRepository.findOne({ where: { id } });
    return situation;
  }

  async findByUserId(id: string) {
    const sidtuations = await this.situationRepository.find({
      where: { user: { id } },
    });
    return sidtuations;
  }

  async findAll() {
    const sidtuations = await this.situationRepository.find();
    return sidtuations;
  }

  async update(
    id: number,
    updateSituationDto: UpdateSituationDto,
    userId: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const situation = await this.situationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!situation) {
      throw new NotFoundException();
    }

    if (situation.user.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.situationRepository.update(id, updateSituationDto);

    const updatedSituation = await this.situationRepository.findOne({
      where: { id },
    });

    return updatedSituation;
  }

  async delete(id: number, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const situation = await this.situationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!situation) {
      throw new NotFoundException();
    }

    if (situation.user?.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.situationRepository.delete(id);

    return id;
  }
}

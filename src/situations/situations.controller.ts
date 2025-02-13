import { Controller, Get, Query } from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationRecommendDto } from './dto/situation-recommend.dto';

@Controller('situations')
export class SituationsController {
  constructor(private readonly situationsService: SituationsService) {}

  @Get('recommend')
  async getRecommendationsEndpoint(
    @Query()
    situationRecommendDto: SituationRecommendDto,
  ) {
    return await this.situationsService.getSituationsRecommed(
      situationRecommendDto,
    );
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationRecommendDto } from './dto/situation-recommend.dto';

@Controller('situations')
export class SituationsController {
  constructor(private readonly situationsService: SituationsService) {}

  @Post('recommend')
  async recommendationsEndpoint(
    @Body()
    situationRecommendDto: SituationRecommendDto,
  ) {
    return await this.situationsService.recommend(situationRecommendDto);
  }
}

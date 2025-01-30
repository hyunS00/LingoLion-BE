import { Controller, Get, ValidationPipe, Body, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { GetRecommendationsDto } from './dto/get-recommendation.dto';
import { RecommendType } from './entities/recommendation.entity';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get(':type')
  async getRecommendationsEndpoint(
    @Param('type') type: RecommendType,
    @Body(new ValidationPipe({ transform: true }))
    getRecommendationsDto: GetRecommendationsDto,
  ) {
    return await this.recommendationsService.getRecommendations(
      type,
      getRecommendationsDto,
    );
  }
}

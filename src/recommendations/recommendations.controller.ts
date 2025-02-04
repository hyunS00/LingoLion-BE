import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { GetRecommendationsDto } from './dto/get-recommendation.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  async getRecommendationsEndpoint(
    @Query()
    getRecommendationsDto: GetRecommendationsDto,
  ) {
    return await this.recommendationsService.getRecommendations(
      getRecommendationsDto,
    );
  }
}

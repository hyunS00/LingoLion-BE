import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { RecommendType } from '../entities/recommendation.entity';

export class GetRecommendationsDto {
  @IsEnum(RecommendType)
  type: RecommendType;

  @IsString()
  @ValidateIf(
    (dto: GetRecommendationsDto) =>
      dto.type === RecommendType.AiRole ||
      dto.type === RecommendType.UserRole ||
      dto.type === RecommendType.Goal,
  )
  place?: string;

  @IsString()
  @ValidateIf(
    (dto: GetRecommendationsDto) =>
      dto.type === RecommendType.UserRole || dto.type === RecommendType.Goal,
  )
  aiRole?: string;

  @IsString()
  @ValidateIf((dto: GetRecommendationsDto) => dto.type === RecommendType.Goal)
  userRole?: string;
}

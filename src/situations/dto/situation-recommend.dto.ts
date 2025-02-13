import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { SituationType } from '../entities/situation.entity';

export class SituationRecommendDto {
  @IsEnum(SituationType)
  type: SituationType;

  @IsString()
  @ValidateIf(
    (dto: SituationRecommendDto) =>
      dto.type === SituationType.AiRole ||
      dto.type === SituationType.UserRole ||
      dto.type === SituationType.Goal,
  )
  place?: string;

  @IsString()
  @ValidateIf(
    (dto: SituationRecommendDto) =>
      dto.type === SituationType.UserRole || dto.type === SituationType.Goal,
  )
  aiRole?: string;

  @IsString()
  @ValidateIf((dto: SituationRecommendDto) => dto.type === SituationType.Goal)
  userRole?: string;
}

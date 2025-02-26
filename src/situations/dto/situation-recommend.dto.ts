import { IsEnum, IsIn, IsString, ValidateIf } from 'class-validator';
import { SituationType } from '../entities/situation.entity';

export const SituationRecommendType = {
  ...SituationType,
  All: 'all' as const,
} as const;
export type SituationRecommendTypeValue =
  (typeof SituationRecommendType)[keyof typeof SituationRecommendType];

export class SituationRecommendDto {
  @IsIn(Object.values(SituationRecommendType))
  type: SituationRecommendTypeValue;

  @IsString()
  place?: string;

  @IsString()
  aiRole?: string;

  @IsString()
  userRole?: string;

  @IsString()
  goal?: string;
}

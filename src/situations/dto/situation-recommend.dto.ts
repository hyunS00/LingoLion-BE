import {
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { SituationType } from '../entities/situation.entity';
import { PartialType } from '@nestjs/mapped-types';
import { SituationDto } from './situation.dto';

export const SituationRecommendType = {
  ...SituationType,
  All: 'all' as const,
} as const;
export type SituationRecommendTypeValue =
  (typeof SituationRecommendType)[keyof typeof SituationRecommendType];

export class SituationRecommendDto extends PartialType(SituationDto) {
  @IsIn(Object.values(SituationRecommendType))
  type: SituationRecommendTypeValue;

  @IsString()
  @IsOptional()
  metaData?: string;
}

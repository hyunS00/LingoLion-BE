import { IsEnum, IsString } from 'class-validator';
import { BaseTable } from 'src/common/entities/base-table.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

export enum RecommendType {
  'place',
  'aiRole',
  'userRole',
  'situation',
  'goal',
}

export class Recommendation extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEnum(RecommendType)
  type: RecommendType;

  @IsString()
  name: string;
}

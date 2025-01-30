import { BaseTable } from 'src/common/entities/base-table.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export enum RecommendType {
  'Place' = 'place',
  'AiRole' = 'aiRole',
  'UserRole' = 'userRole',
  'Situation' = 'situation',
  'Goal' = 'goal',
}

export class Recommendation extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: RecommendType;

  @Column()
  name: string;
}

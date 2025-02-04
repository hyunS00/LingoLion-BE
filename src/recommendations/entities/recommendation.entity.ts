import { BaseTable } from 'src/common/entities/base-table.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RecommendType {
  'Place' = 'place',
  'AiRole' = 'aiRole',
  'UserRole' = 'userRole',
  'Goal' = 'goal',
}

@Entity()
export class Recommendation extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: RecommendType;

  @Column()
  name: string;
}

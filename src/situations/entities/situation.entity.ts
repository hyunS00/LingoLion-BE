import { BaseTable } from 'src/common/entities/base-table.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum SituationType {
  'Place' = 'place',
  'AiRole' = 'aiRole',
  'UserRole' = 'userRole',
  'Goal' = 'goal',
}

@Entity()
export class Situation extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: SituationType;

  @Column()
  name: string;
}

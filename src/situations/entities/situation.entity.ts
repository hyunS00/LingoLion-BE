import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum SituationType {
  'Place' = 'place',
  'AiRole' = 'aiRole',
  'UserRole' = 'userRole',
  'Goal' = 'goal',
}

@Entity()
export class Situation extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: SituationType;

  @Column()
  name: string;
}

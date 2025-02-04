import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Situation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  place: string;

  @Column()
  aiRole: string;

  @Column()
  userRole: string;

  @Column()
  goal: string;
}

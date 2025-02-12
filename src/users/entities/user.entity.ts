import { Exclude, Transform } from 'class-transformer';
import { BaseTable } from 'src/common/entities/base-table.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  Admin,
  Common,
}

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false, nullable: false })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    enum: Role,
    default: Role.Common,
    nullable: false,
  })
  @Transform(({ value }) => Role[value])
  role: Role;
}

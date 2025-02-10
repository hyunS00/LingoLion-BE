import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

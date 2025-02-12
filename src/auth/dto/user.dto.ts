import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

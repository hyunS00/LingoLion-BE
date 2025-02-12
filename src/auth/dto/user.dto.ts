import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/users/entities/user.entity';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}

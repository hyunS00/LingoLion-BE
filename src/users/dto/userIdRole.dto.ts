import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { Role } from 'src/users/entities/user.entity';

export class UserIdRoleDto {
  @IsUUID()
  id: string;

  @IsEnum(Role)
  role: Role;
}

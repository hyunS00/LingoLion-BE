import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/users/entities/user.entity';

export class JwtPayloadDto {
  @IsDefined()
  @IsString()
  sub: string;

  @IsDefined()
  @IsNumber()
  iat: number;

  @IsDefined()
  @IsNumber()
  exp: number;

  @IsDefined()
  @Matches('lingo-lion')
  iss: string;

  @IsEnum(Role)
  role: Role;
}

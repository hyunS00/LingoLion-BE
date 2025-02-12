import {
  IsDate,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  IsVariableWidth,
  Matches,
} from 'class-validator';
import { Role } from 'src/users/entities/user.entity';

export class JwtPayloadDto {
  @IsDefined()
  @IsString()
  sub: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsNumber()
  iat: number;

  @IsDefined()
  @IsNumber()
  exp: number;

  @IsDefined()
  @Matches('lingo-lion')
  iss: number;

  @IsEnum(Role)
  role: Role;
}

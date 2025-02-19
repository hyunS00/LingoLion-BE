import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { JwtPayloadDto } from '../dto/jwtPayload.dto';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: Record<string, unknown>): Promise<UserDto> {
    const payloadDto = plainToInstance(JwtPayloadDto, payload);

    try {
      await validateOrReject(payloadDto);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const userDto: UserDto = {
      id: payloadDto.sub,
      role: payloadDto.role,
    };

    return userDto;
  }
}

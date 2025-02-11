import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { JwtPayloadDto } from '../dto/jwtPayload.dto';
import { ConfigService } from '@nestjs/config';

export function createBaseJwtStrategy(strategyName: string) {
  @Injectable()
  class BaseJwtStrategy extends PassportStrategy(Strategy, strategyName) {
    constructor(options: { secret: string }) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: options.secret,
      });
    }

    async validate(payload: any): Promise<JwtPayloadDto> {
      const payloadDto = plainToInstance(JwtPayloadDto, payload);
      try {
        await validateOrReject(payloadDto);
      } catch (error) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }
      return payloadDto;
    }
  }
  return BaseJwtStrategy;
}

@Injectable()
export class JwtAccessStrategy extends createBaseJwtStrategy('jwt-access') {
  constructor(private readonly configService: ConfigService) {
    super({
      secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
}

@Injectable()
export class JwtRefreshStrategy extends createBaseJwtStrategy('jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
  }
}

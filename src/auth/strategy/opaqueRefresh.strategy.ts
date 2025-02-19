import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class OpaqueRefreshStrategy extends PassportStrategy(
  Strategy,
  'opaque-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(req: Request & { cookies?: Record<string, string> }) {
    const refreshToken = req.cookies['refresh'];
    const splitToken = refreshToken.split('.');
    if (splitToken.length !== 2) {
      throw new UnauthorizedException();
    }
    const [tokenId, secret] = splitToken;
    const user = await this.authService.validateRefreshToken(tokenId, secret);

    return user;
  }
}

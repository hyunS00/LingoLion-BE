import { NestMiddleware, UnauthorizedException } from '@nestjs/common';

export class AuthHeaderValidationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('authorization 헤더가 누락됐습니다');
    }

    next();
  }
}

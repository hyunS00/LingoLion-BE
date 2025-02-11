import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtAccessStrategy } from './strategy/jwtAccess.strategy';
import { JwtRefreshStrategy } from './strategy/jwtRefresh.strategy';

@Module({
  imports: [
    JwtModule.register({ signOptions: { issuer: 'lingo-lion' } }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}

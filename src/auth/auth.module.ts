import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpBasicStrategy } from './strategy/basic.strategy';
import { JwtAccessStrategy } from './strategy/jwtAccess.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh.entity';
import { User } from 'src/users/entities/user.entity';
import { OpaqueRefreshStrategy } from './strategy/opaqueRefresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, User]),
    JwtModule.register({ signOptions: { issuer: 'lingo-lion' } }),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    OpaqueRefreshStrategy,
    HttpBasicStrategy,
  ],
})
export class AuthModule {}

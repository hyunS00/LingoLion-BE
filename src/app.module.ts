import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConversationsModule } from './conversations/conversations.module';
import { Conversation } from './conversations/entities/conversation.entity';
import { Message } from './conversations/entities/message.entity';
import { SituationsModule } from './situations/situations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthHeaderValidationMiddleware } from './auth/middleware/authHeader-validation.middleware';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessAuthGuard } from './auth/gaurd/jwtAccessAuth.guard';
import { RBACGuard } from './auth/gaurd/RBAC.guard';
import { RefreshToken } from './auth/entities/refresh.entity';
import { AiModule } from './ai/ai.module';
import { Situation } from './situations/entities/situation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: configService.get<string>('NODE_ENV') !== 'prod',
        ssl: configService.get<string>('NODE_ENV') === 'prod',
        entities: [Conversation, Message, Situation, User, RefreshToken],
      }),
      inject: [ConfigService],
    }),
    ConversationsModule,
    SituationsModule,
    AuthModule,
    UsersModule,
    AiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthHeaderValidationMiddleware)
      .exclude({ path: 'auth/login', method: RequestMethod.POST })
      .exclude({ path: 'auth/join', method: RequestMethod.POST })
      .exclude({ path: 'auth/refresh', method: RequestMethod.POST })
      .forRoutes('*');
  }
}

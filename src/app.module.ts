import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConversationsModule } from './conversations/conversations.module';
import { Conversation } from './conversations/entities/conversation.entity';
import { Message } from './conversations/entities/message.entity';
import { OpenAIModule } from './openAI/openAI.module';
import { SituationsModule } from './situations/situations.module';
import { Situation } from './conversations/entities/situation.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthHeaderValidationMiddleware } from './auth/middleware/authHeader-validation.middleware';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessAuthGuard } from './auth/gaurd/jwtAccessAuth.guard';
import { RBACGuard } from './auth/gaurd/RBAC.guard';

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
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        entities: [Conversation, Message, Situation, User],
      }),
      inject: [ConfigService],
    }),
    ConversationsModule,
    OpenAIModule,
    SituationsModule,
    AuthModule,
    UsersModule,
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
      .forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { ConversationsModule } from './conversations/conversations.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversations/entities/conversation.entity';
import { Message } from './conversations/entities/message.entity';
import { OpenAIModule } from './openAI/openAI.module';

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
        entities: [Conversation, Message],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConversationsModule,
    OpenAIModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

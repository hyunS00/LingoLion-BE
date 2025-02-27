import { Module } from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationsController } from './situations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Situation } from './entities/situation.entity';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Situation, User]),
    AiModule,
    PromptModule,
  ],
  controllers: [SituationsController],
  providers: [SituationsService],
})
export class SituationsModule {}

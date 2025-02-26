import { Module } from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationsController } from './situations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Situation } from './entities/situation.entity';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Situation]), AiModule, PromptModule],
  controllers: [SituationsController],
  providers: [SituationsService],
})
export class SituationsModule {}

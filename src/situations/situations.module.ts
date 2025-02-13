import { Module } from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationsController } from './situations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Situation } from './entities/situation.entity';
import { OpenAIService } from 'src/openAI/openAI.service';

@Module({
  imports: [TypeOrmModule.forFeature([Situation])],
  controllers: [SituationsController],
  providers: [SituationsService, OpenAIService],
})
export class RecommendationsModule {}

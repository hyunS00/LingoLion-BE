import { Module } from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationsController } from './situations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Situation } from './entities/situation.entity';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Situation]), AiModule],
  controllers: [SituationsController],
  providers: [SituationsService],
})
export class SituationsModule {}

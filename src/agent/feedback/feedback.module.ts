import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { TypeOrmFeedbackRepository } from 'src/feedback/repositories/typeorm-feedback.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from 'src/feedback/entities/feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), AiModule, PromptModule],
  providers: [
    FeedbackService,
    { provide: 'IFeedbackRepository', useClass: TypeOrmFeedbackRepository },
  ],
  exports: [FeedbackService],
})
export class FeedbackModule {}

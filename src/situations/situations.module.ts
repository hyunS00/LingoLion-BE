import { Module } from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationsController } from './situations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Situation } from './entities/situation.entity';
import { AiModule } from 'src/ai/ai.module';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmSituationRepository } from './repositories/typeorm-situation.repository';
import { TypeOrmUserRepository } from 'src/users/repositories/typeorm-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Situation, User]),
    AiModule,
    PromptModule,
  ],
  controllers: [SituationsController],
  providers: [
    { provide: 'ISituationRepository', useClass: TypeOrmSituationRepository },
    { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
    SituationsService,
  ],
})
export class SituationsModule {}

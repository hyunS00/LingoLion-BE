import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './repositories/typeorm-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}

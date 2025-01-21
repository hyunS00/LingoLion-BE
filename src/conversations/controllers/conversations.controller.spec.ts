import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../services/conversations.service';
import { ConversationsController } from './conversations.controller';

describe('ChatsController', () => {
  let controller: ConversationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [ConversationsService],
    }).compile();

    controller = module.get<ConversationsController>(ConversationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

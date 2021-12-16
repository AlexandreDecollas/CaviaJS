import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomController } from './book-room.controller';

describe('BookRoomController', () => {
  let controller: BookRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookRoomController],
    }).compile();

    controller = module.get<BookRoomController>(BookRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomController } from './book-room.controller';
import { BookRoomService } from '../services/book-room/book-room.service';

describe('BookRoomController', () => {
  let controller: BookRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookRoomController],
      providers: [
        {
          provide: BookRoomService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BookRoomController>(BookRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

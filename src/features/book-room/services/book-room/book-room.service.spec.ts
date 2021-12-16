import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomService } from './book-room.service';

describe('BookRoomService', () => {
  let service: BookRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookRoomService],
    }).compile();

    service = module.get<BookRoomService>(BookRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

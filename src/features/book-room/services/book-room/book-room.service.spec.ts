import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomService } from './book-room.service';
import { ConnectionInitializerService } from '../../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('BookRoomService', () => {
  let service: BookRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRoomService,
        ConnectionInitializerService,
        IdGeneratorService,
        EventEmitter2,
      ],
    }).compile();

    service = module.get<BookRoomService>(BookRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

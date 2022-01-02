import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomService } from './book-room.service';
import { ESDBConnectionService } from '../../../../eventstore-connector/connection-initializer/esdb-connection.service';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { Eventbus } from '../../../../eventbus/eventbus.service';

describe('BookRoomService', () => {
  let service: BookRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRoomService,
        ESDBConnectionService,
        IdGeneratorService,
        {
          provide: Eventbus,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BookRoomService>(BookRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

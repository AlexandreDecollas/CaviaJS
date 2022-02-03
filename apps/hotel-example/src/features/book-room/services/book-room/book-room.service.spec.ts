import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomService } from './book-room.service';
import { ESDBConnectionService } from '../../../../event-modelling-tooling/eventstore-connector/connection-initializer/esdb-connection.service';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { Eventbus } from '../../../../event-modelling-tooling/eventbus/eventbus.service';
import { Logger } from '@nestjs/common';

describe('BookRoomService', () => {
  let service: BookRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRoomService,
        IdGeneratorService,
        {
          provide: ESDBConnectionService,
          useValue: {},
        },
        {
          provide: Eventbus,
          useValue: {},
        },
        {
          provide: Logger,
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

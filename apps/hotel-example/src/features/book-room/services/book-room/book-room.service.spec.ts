import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomService } from './book-room.service';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { Logger } from '@nestjs/common';
import { ESDBConnectionService, Eventbus } from 'cavia-js';

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

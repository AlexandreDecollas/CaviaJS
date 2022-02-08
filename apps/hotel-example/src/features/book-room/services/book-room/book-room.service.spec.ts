import { Test, TestingModule } from '@nestjs/testing';
import { BookRoomService } from './book-room.service';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { Logger } from '@nestjs/common';
import { ESDBConnectionService, Eventbus } from 'cavia-js';
import { RoomDoesNotExistError } from './room-does-not-exist.error';

describe('BookRoomService', () => {
  let service: BookRoomService;

  const roomAvailabilityProjectionSpy = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRoomService,
        IdGeneratorService,
        {
          provide: ESDBConnectionService,
          useValue: {
            getConnectedClient: () => {
              return {
                getProjectionState: roomAvailabilityProjectionSpy,
              };
            },
          },
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

  it('should return a RoomDoesNotExistError when the room does not exist', async () => {
    expect.assertions(1);
    roomAvailabilityProjectionSpy.mockResolvedValueOnce(undefined);
    try {
      await service.checkRoomAvailability(123);
    } catch (e) {
      expect(e).toEqual(new RoomDoesNotExistError(123));
    }
  });
});

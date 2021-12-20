import { Test, TestingModule } from '@nestjs/testing';
import { AddRoomService } from './add-room.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';

describe('AddRoomService', () => {
  let service: AddRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddRoomService, EventEmitter2, IdGeneratorService],
    }).compile();

    service = module.get<AddRoomService>(AddRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

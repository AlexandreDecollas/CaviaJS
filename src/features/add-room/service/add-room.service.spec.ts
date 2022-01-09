import { Test, TestingModule } from '@nestjs/testing';
import { AddRoomService } from './add-room.service';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { Eventbus } from '../../../event-modelling-tooling/eventbus/eventbus.service';

describe('AddRoomService', () => {
  let service: AddRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddRoomService,
        {
          provide: Eventbus,
          useValue: {},
        },
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<AddRoomService>(AddRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

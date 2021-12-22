import { Test, TestingModule } from '@nestjs/testing';
import { CleaningService } from './cleaning.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ConnectionInitializerService } from '../../../eventstore-connector/connection-initializer/connection-initializer.service';

describe('CleaningService', () => {
  let service: CleaningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleaningService,
        EventEmitter2,
        {
          provide: IdGeneratorService,
          useValue: { generateId: jest.fn() },
        },
        {
          provide: ConnectionInitializerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CleaningService>(CleaningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

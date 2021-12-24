import { Test, TestingModule } from '@nestjs/testing';
import { CheckOutService } from './check-out.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ConnectionInitializerService } from '../../../eventstore-connector/connection-initializer/connection-initializer.service';

describe('CheckOutService', () => {
  let service: CheckOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckOutService,
        {
          provide: EventEmitter2,
          useValue: {},
        },
        {
          provide: IdGeneratorService,
          useValue: {},
        },
        {
          provide: ConnectionInitializerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CheckOutService>(CheckOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

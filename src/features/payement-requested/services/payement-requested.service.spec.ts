import { Test, TestingModule } from '@nestjs/testing';
import { PayementRequestedService } from './payement-requested.service';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PayementRequestedService', () => {
  let service: PayementRequestedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayementRequestedService,
        {
          provide: IdGeneratorService,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PayementRequestedService>(PayementRequestedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

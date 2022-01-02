import { Test, TestingModule } from '@nestjs/testing';
import { CheckOutService } from './check-out.service';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ESDBConnectionService } from '../../../eventstore-connector/connection-initializer/esdb-connection.service';
import { Eventbus } from '../../../eventbus/eventbus.service';

describe('CheckOutService', () => {
  let service: CheckOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckOutService,
        {
          provide: Eventbus,
          useValue: {},
        },
        {
          provide: IdGeneratorService,
          useValue: {},
        },
        {
          provide: ESDBConnectionService,
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

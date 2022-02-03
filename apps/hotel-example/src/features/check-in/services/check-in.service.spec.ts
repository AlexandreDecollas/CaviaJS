import { Test, TestingModule } from '@nestjs/testing';
import { CheckInService } from './check-in.service';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ESDBConnectionService, Eventbus } from 'cavia-js';

describe('CheckInService', () => {
  let service: CheckInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInService,
        {
          provide: Eventbus,
          useValue: {},
        },
        IdGeneratorService,
        {
          provide: ESDBConnectionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CheckInService>(CheckInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

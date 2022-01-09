import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { Eventbus } from '../../../event-modelling-tooling/eventbus/eventbus.service';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: Eventbus,
          useValue: {},
        },
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

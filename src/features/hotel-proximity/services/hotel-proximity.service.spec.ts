import { Test, TestingModule } from '@nestjs/testing';
import { HotelProximityService } from './hotel-proximity.service';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { Eventbus } from '../../../event-modelling-tooling/eventbus/eventbus.service';

describe('HotelProximityService', () => {
  let service: HotelProximityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelProximityService,
        {
          provide: Eventbus,
          useValue: {},
        },
        {
          provide: IdGeneratorService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<HotelProximityService>(HotelProximityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

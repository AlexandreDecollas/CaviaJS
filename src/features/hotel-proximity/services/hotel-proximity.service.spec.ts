import { Test, TestingModule } from '@nestjs/testing';
import { HotelProximityService } from './hotel-proximity.service';

describe('HotelProximityService', () => {
  let service: HotelProximityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelProximityService],
    }).compile();

    service = module.get<HotelProximityService>(HotelProximityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

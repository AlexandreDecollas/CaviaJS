import { Test, TestingModule } from '@nestjs/testing';
import { HotelProximityController } from './hotel-proximity.controller';
import { HotelProximityService } from '../services/hotel-proximity.service';

describe('HotelProximityController', () => {
  let controller: HotelProximityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelProximityController],
      providers: [
        {
          provide: HotelProximityService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HotelProximityController>(HotelProximityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

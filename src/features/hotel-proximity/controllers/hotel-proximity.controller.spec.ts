import { Test, TestingModule } from '@nestjs/testing';
import { HotelProximityController } from './hotel-proximity.controller';

describe('HotelProximityController', () => {
  let controller: HotelProximityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelProximityController],
    }).compile();

    controller = module.get<HotelProximityController>(HotelProximityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

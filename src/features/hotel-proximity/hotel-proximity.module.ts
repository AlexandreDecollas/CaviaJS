import { Module } from '@nestjs/common';
import { HotelProximityController } from './controllers/hotel-proximity.controller';
import { HotelProximityService } from './services/hotel-proximity.service';

@Module({
  controllers: [HotelProximityController],
  providers: [HotelProximityService],
})
export class HotelProximityModule {}

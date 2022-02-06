import { Module } from '@nestjs/common';
import { HotelProximityCommand } from './hotel-proximity.command';

@Module({
  controllers: [HotelProximityCommand],
})
export class HotelProximityModule {}

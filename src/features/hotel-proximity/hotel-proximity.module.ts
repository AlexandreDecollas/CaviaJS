import { Module } from '@nestjs/common';
import { HotelProximityController } from './controllers/hotel-proximity.controller';
import { HotelProximityService } from './services/hotel-proximity.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';

@Module({
  imports: [],
  controllers: [HotelProximityController],
  providers: [HotelProximityService, IdGeneratorService],
})
export class HotelProximityModule {}

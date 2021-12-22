import { Controller, Get, Param } from '@nestjs/common';
import { HotelProximityService } from '../services/hotel-proximity.service';

@Controller('hotel-proximity')
export class HotelProximityController {
  constructor(private readonly hotelProximityService: HotelProximityService) {}

  @Get('guest/left/:clientName')
  public async guestLeft(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    return this.hotelProximityService.guestLeftHotel(clientName);
  }

  @Get('guest/entered/:clientName')
  public async guestEntered(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    return this.hotelProximityService.guestEnteredHotel(clientName);
  }
}

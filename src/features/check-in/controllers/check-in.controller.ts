import { Controller, Get, Param } from '@nestjs/common';
import { CheckInService } from '../services/check-in.service';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Get('/:clientName')
  public async register(@Param('clientName') clientName: string) {
    return this.checkInService.checkIn(clientName);
  }
}

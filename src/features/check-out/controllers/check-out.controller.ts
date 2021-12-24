import { Controller, Get, Param } from '@nestjs/common';
import { CheckOutService } from '../services/check-out.service';

@Controller('check-out')
export class CheckOutController {
  constructor(private readonly checkOutService: CheckOutService) {}

  @Get('check-out/:clientName')
  public async checkOut(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    return this.checkOutService.checkout(clientName);
  }

  @Get('check-client-roster')
  public async checkGuestRoster(): Promise<void> {
    return this.checkOutService.checkGuestRoster();
  }
}

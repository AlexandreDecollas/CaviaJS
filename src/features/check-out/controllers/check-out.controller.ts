import { Controller, Get, Param } from '@nestjs/common';
import { CheckOutService } from '../services/check-out.service';

@Controller('check-out')
export class CheckOutController {
  constructor(private readonly checkOutService: CheckOutService) {}

  @Get('/:clientName')
  public async checkOut(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    return this.checkOutService.checkout(clientName);
  }

  @Get('check-client-in-roster/:clientName')
  public async checkGuestRoster(
    @Param('clientName') clientName: string,
  ): Promise<boolean> {
    return this.checkOutService.checkClientInRoster(clientName);
  }
}

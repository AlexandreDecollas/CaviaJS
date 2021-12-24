import { Controller, Get, Param } from '@nestjs/common';
import { PayementRequestedService } from '../services/payement-requested.service';

@Controller('payement-requested')
export class PayementRequestedController {
  constructor(
    private readonly payementRequestedService: PayementRequestedService,
  ) {}

  @Get('/:clientName')
  public async register(@Param('clientName') clientName: string) {
    return this.payementRequestedService.requestPayement(clientName);
  }
}

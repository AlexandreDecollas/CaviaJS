import { Get, Param } from '@nestjs/common';
import { CheckInService } from './services/check-in.service';
import { buildRegisteredGuestsProjection } from './projections/check-in.projection';
import { Command, provideProjection } from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

provideProjection({
  name: 'registered-guests',
  content: buildRegisteredGuestsProjection(),
});

@Command({
  restOptions: { path: 'check-in' },
})
export class CheckInCommand {
  constructor(private readonly checkInService: CheckInService) {}

  @Get('/:clientName')
  @ApiParam({ name: 'clientName', example: 'Rambo', type: String })
  public async register(@Param('clientName') clientName: string) {
    return this.checkInService.checkIn(clientName);
  }
}

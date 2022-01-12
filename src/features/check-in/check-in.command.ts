import { Get, Param } from '@nestjs/common';
import { CheckInService } from './services/check-in.service';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildRegisteredGuestsProjection } from './projections/check-in.projection';
import { Command } from '../../event-modelling-tooling/command-decorators/class-decorators/command.decorator';

provideProjection({
  name: 'registered-guests',
  content: buildRegisteredGuestsProjection(),
});

@Command({
  entryPoints: { restPath: 'check-in' },
  providers: [CheckInService],
})
export class CheckInCommand {
  constructor(private readonly checkInService: CheckInService) {}

  @Get('/:clientName')
  public async register(@Param('clientName') clientName: string) {
    return this.checkInService.checkIn(clientName);
  }
}

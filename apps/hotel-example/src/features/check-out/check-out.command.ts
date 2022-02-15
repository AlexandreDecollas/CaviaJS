import { Get, Param } from '@nestjs/common';
import {
  buildGuestRosterProjection,
  GuestRosterState,
} from './projections/guest-roster.projection';
import { CheckedOutEvent } from '../../model/checked-out.event';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { Client } from '@eventstore/db-client/dist/Client';
import {
  Command,
  ESDBConnectionService,
  Eventbus,
  provideProjection,
} from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

provideProjection({
  name: 'guestRoster',
  content: buildGuestRosterProjection(),
});

@Command({
  restOptions: { path: 'check-out' },
})
export class CheckOutCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connection: ESDBConnectionService,
  ) {}

  @Get('/:clientName')
  @ApiParam({ name: 'clientName', example: 'Rambo', type: String })
  public async checkOut(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    const event: CheckedOutEvent = new CheckedOutEvent(
      { clientName, id: this.idGeneratorService.generateId() },
      { streamName: 'guest.checkout' },
    );

    await this.eventEmitter.emit(event);
  }

  @Get('check-client-in-roster/:clientName')
  @ApiParam({ name: 'clientName', example: 'Rambo', type: String })
  public async checkGuestRoster(
    @Param('clientName') clientName: string,
  ): Promise<boolean> {
    const client: Client = await this.connection.getConnectedClient();

    const state: GuestRosterState = await client.getProjectionState(
      'guestRoster',
    );
    return state.roster[clientName] !== undefined;
  }
}

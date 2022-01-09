import { Get, Param } from '@nestjs/common';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import {
  buildGuestRosterProjection,
  GuestRosterState,
} from './projections/guest-roster.projection';
import { Command } from '../../event-modelling-tooling/command/command.decorator';
import { CheckedOutEvent } from '../../model/checked-out.event';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { ESDBConnectionService } from '../../event-modelling-tooling/eventstore-connector/connection-initializer/esdb-connection.service';
import { Client } from '@eventstore/db-client/dist/Client';

provideProjection({
  name: 'guestRoster',
  content: buildGuestRosterProjection(),
});

@Command({
  entryPoint: { restPath: 'check-out' },
})
export class CheckOutCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connection: ESDBConnectionService,
  ) {}

  @Get('/:clientName')
  public async checkOut(
    @Param('clientName') clientName: string,
  ): Promise<void> {
    const event: CheckedOutEvent = {
      data: { clientName, id: this.idGeneratorService.generateId() },
      metadata: { streamName: 'guest.checkout' },
      type: 'CheckedOutEvent',
    };

    this.eventEmitter.emit(event.metadata.streamName, event);
  }

  @Get('check-client-in-roster/:clientName')
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

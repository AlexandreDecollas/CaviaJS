import { HttpException, Injectable } from '@nestjs/common';
import { CheckedInEvent } from '../../../model/checked-in.event';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ESDBConnectionService } from '../../../event-modelling-tooling/eventstore-connector/connection-initializer/esdb-connection.service';
import { CheckInState } from '../projections/check-in.projection';
import { Client } from '@eventstore/db-client/dist/Client';
import { Eventbus } from '../../../event-modelling-tooling/eventbus/eventbus.service';

@Injectable()
export class CheckInService {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connection: ESDBConnectionService,
  ) {}

  public async checkIn(clientName: string) {
    const client: Client = await this.connection.getConnectedClient();
    const projectionState: CheckInState =
      await client.getProjectionState<CheckInState>('registered-guests');

    let isClientRegistered = false;
    for (const guest of projectionState.guests) {
      if (guest === clientName) {
        isClientRegistered = true;
      }
    }
    if (!isClientRegistered) {
      throw new HttpException('Unregistered client tries to check-in', 401);
    }

    const event: CheckedInEvent = {
      metadata: { streamName: 'guest.checkin' },
      type: 'CheckedInEvent',
      data: {
        id: this.idGeneratorService.generateId(),
        clientName,
      },
    };

    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}

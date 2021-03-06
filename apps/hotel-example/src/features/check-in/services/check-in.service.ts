import { HttpException, Injectable } from '@nestjs/common';
import { CheckedInEvent } from '../../../model/checked-in.event';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { CheckInState } from '../projections/check-in.projection';
import { Client } from '@eventstore/db-client/dist/Client';
import { ESDBConnectionService, Eventbus } from 'cavia-js';

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

    const event: CheckedInEvent = new CheckedInEvent(
      {
        id: this.idGeneratorService.generateId(),
        clientName,
      },
      {},
    );

    await this.eventEmitter.emit('guest.checkin', event);
  }
}

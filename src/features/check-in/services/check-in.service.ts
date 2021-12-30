import { HttpException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CheckedInEvent } from '../../../model/checked-in.event';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ConnectionInitializerService } from '../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { CheckInState } from '../projections/check-in.projection';

@Injectable()
export class CheckInService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  public async checkIn(clientName: string) {
    const projectionState: CheckInState =
      await this.connectionInitializerService
        .getConnectedClient()
        .getProjectionState('registered-guests');

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

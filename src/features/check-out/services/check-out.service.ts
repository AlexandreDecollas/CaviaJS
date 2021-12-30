import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ConnectionInitializerService } from '../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { CheckedOutEvent } from '../../../model/checked-out.event';
import { GuestRosterState } from '../projections/guest-roster.projection';

@Injectable()
export class CheckOutService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  public checkout(clientName: string) {
    const event: CheckedOutEvent = {
      data: { clientName, id: this.idGeneratorService.generateId() },
      metadata: { streamName: 'guest.checkout' },
      type: 'CheckedOutEvent',
    };

    this.eventEmitter.emit(event.metadata.streamName, event);
  }

  public async checkClientInRoster(clientName: string): Promise<boolean> {
    const state: GuestRosterState = await this.connectionInitializerService
      .getConnectedClient()
      .getProjectionState('guestRoster');
    return state.roster[clientName] !== undefined;
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ConnectionInitializerService } from '../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { CheckedOutEvent } from '../../../model/checked-out.event';

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
      metadata: { streamName: 'manager.check-out' },
      type: 'CheckedOutEvent',
    };

    this.eventEmitter.emit(event.metadata.streamName, event);
  }

  public async checkGuestRoster(): Promise<void> {
    await this.connectionInitializerService
      .getConnectedClient()
      .getProjectionState('');
  }
}

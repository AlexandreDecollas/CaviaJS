import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { PayementRequestedEvent } from '../../../model/payement-requested.event';

@Injectable()
export class PayementRequestedService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public requestPayement(clientName: string) {
    const event: PayementRequestedEvent = {
      data: {
        id: this.idGeneratorService.generateId(),
        clientName,
      },
      metadata: { streamName: 'guest.request-payement' },
      type: 'PayementRequestedEvent',
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}

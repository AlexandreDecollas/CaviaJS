import { Injectable } from '@nestjs/common';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { PayementRequestedEvent } from '../../../model/payement-requested.event';
import { Eventbus } from '../../../eventbus/eventbus.service';

@Injectable()
export class PayementRequestedService {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public async requestPayement(clientName: string) {
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

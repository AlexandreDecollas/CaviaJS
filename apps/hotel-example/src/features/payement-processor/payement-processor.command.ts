import { buildPayementToProcessProjection } from './projections/payement-to-process.projection';
import { PayementRequestedEvent } from '../../model/payement-requested.event';
import { PayementSuccededEvent } from '../../model/payement-succeded.event';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import {
  Command,
  Eventbus,
  PersubEventHook,
  providePersistentSubscription,
  provideProjection,
} from 'cavia-js';

providePersistentSubscription({
  name: 'paymentProcessor',
  streamName: 'processor.payements-to-process',
  groupName: 'payement-processor',
  settings: {
    minCheckpointCount: 1,
  },
});

provideProjection({
  name: 'payementsToProcess',
  content: buildPayementToProcessProjection(),
});

@Command({
  restOptions: { path: 'paymentProcessor' },
})
export class PayementProcessorCommand {
  constructor(
    private readonly idGeneratorService: IdGeneratorService,
    private readonly eventEmitter: Eventbus,
  ) {}

  @PersubEventHook()
  public async persubCallback(event: PayementRequestedEvent): Promise<void> {
    const payementSuccededEvent: PayementSuccededEvent =
      new PayementSuccededEvent(
        {
          id: this.idGeneratorService.generateId(),
          clientName: event.data.clientName,
        },
        { streamName: 'guest.payement-succedded' },
      );
    await this.eventEmitter.emit(payementSuccededEvent);
  }
}

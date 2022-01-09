import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildPayementToProcessProjection } from './projections/payement-to-process.projection';
import { providePersistentSubscription } from '../../event-modelling-tooling/eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';
import { Command } from '../../event-modelling-tooling/command/command.decorator';
import { PayementRequestedEvent } from '../../model/payement-requested.event';
import { PayementSuccededEvent } from '../../model/payement-succeded.event';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';

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
  entryPoint: { persubName: 'paymentProcessor' },
})
export class PayementProcessorCommand {
  constructor(
    private readonly idGeneratorService: IdGeneratorService,
    private readonly eventEmitter: Eventbus,
  ) {}

  public persubCallback(event: PayementRequestedEvent): void {
    const payementSuccededEvent: PayementSuccededEvent = {
      metadata: { streamName: 'guest.payement-succedded' },
      data: {
        id: this.idGeneratorService.generateId(),
        clientName: event.data.clientName,
      },
      type: 'PayementSuccededEvent',
    };
    this.eventEmitter.emit(
      payementSuccededEvent.metadata.streamName,
      payementSuccededEvent,
    );
  }
}

import { Module } from '@nestjs/common';
import { PersistentSubscriptionInitializerService } from './persistent-subscription/initializer/persistent-subscription-initializer.service';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildPayementToProcessProjection } from './projections/payement-to-process.projection';
import { providePersistentSubscription } from '../../event-modelling-tooling/eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';

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

@Module({
  providers: [PersistentSubscriptionInitializerService],
})
export class PayementProcessorModule {}

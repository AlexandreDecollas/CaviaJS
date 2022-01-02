import { Module } from '@nestjs/common';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { PersistentSubscriptionInitializerService } from './persistent-subscription/initializer/persistent-subscription-initializer.service';
import { provideProjection } from '../../eventstore-connector/projections/provider/projection.provider';
import { buildPayementToProcessProjection } from './projections/payement-to-process.projection';
import { providePersistentSubscription } from '../../eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';
import { EventbusModule } from '../../eventbus/eventbus.module';

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
  imports: [EventStoreConnectorModule, EventbusModule],
  providers: [IdGeneratorService, PersistentSubscriptionInitializerService],
})
export class PayementProcessorModule {}

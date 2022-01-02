import { Module } from '@nestjs/common';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { PersistentSubscriptionInitializerService } from './persistent-subscription/initializer/persistent-subscription-initializer.service';
import { provideProjection } from '../../eventstore-connector/projections/provider/projection.provider';
import { buildPayementToProcessProjection } from './projections/payement-to-process.projection';

provideProjection({
  name: 'payementsToProcess',
  content: buildPayementToProcessProjection(),
});

@Module({
  imports: [EventStoreConnectorModule],
  providers: [IdGeneratorService, PersistentSubscriptionInitializerService],
})
export class PayementProcessorModule {}

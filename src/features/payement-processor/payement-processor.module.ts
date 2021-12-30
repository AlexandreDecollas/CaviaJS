import { Module } from '@nestjs/common';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { ProjectionInitializerService } from './projections/initializer/projection-initializer.service';
import { PersistentSubscriptionInitializerService } from './persistent-subscription/initializer/persistent-subscription-initializer.service';

@Module({
  imports: [EventStoreConnectorModule],
  providers: [
    IdGeneratorService,
    ProjectionInitializerService,
    PersistentSubscriptionInitializerService,
  ],
})
export class PayementProcessorModule {}

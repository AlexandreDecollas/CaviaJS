import { Module } from '@nestjs/common';
import { ConnectionInitializerService } from './connection-initializer/connection-initializer.service';
import { ProjectionUpserterService } from './projection-upserter/projection-upserter.service';
import { PersistentSubscriptionService } from './persistent-subscription-upserter/persistent-subscription.service';

@Module({
  providers: [
    ConnectionInitializerService,
    ProjectionUpserterService,
    PersistentSubscriptionService,
  ],
  exports: [
    ConnectionInitializerService,
    ProjectionUpserterService,
    PersistentSubscriptionService,
  ],
})
export class EventStoreConnectorModule {}

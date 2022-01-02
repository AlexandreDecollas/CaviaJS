import { Module } from '@nestjs/common';
import { ESDBConnectionService } from './connection-initializer/esdb-connection.service';
import { ProjectionUpserterService } from './projections/upserter/projection-upserter.service';
import { PersistentSubscriptionService } from './persistent-subscription/upserter/persistent-subscription.service';

@Module({
  providers: [
    ESDBConnectionService,
    ProjectionUpserterService,
    PersistentSubscriptionService,
  ],
  exports: [
    ESDBConnectionService,
    ProjectionUpserterService,
    PersistentSubscriptionService,
  ],
})
export class EventStoreConnectorModule {}

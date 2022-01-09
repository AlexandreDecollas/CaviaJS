import { DynamicModule, Global, Module } from '@nestjs/common';
import { ESDBConnectionService } from './connection-initializer/esdb-connection.service';
import { ProjectionUpserterService } from './projections/upserter/projection-upserter.service';
import { PersistentSubscriptionService } from './persistent-subscription/upserter/persistent-subscription.service';
import { CONNECTION_STRING, HEARTBEAT_INTERVAL } from '../constants';
import { HeartbeatService } from './heartbeat/heartbeat.service';

@Global()
@Module({
  providers: [ProjectionUpserterService, PersistentSubscriptionService],
  exports: [ProjectionUpserterService, PersistentSubscriptionService],
})
export class EventStoreConnectorModule {
  public static forRoot(
    connectionString: string,
    checkHeartBeatOnInterval?: number,
  ): DynamicModule {
    return {
      module: EventStoreConnectorModule,
      providers: [
        {
          provide: CONNECTION_STRING,
          useValue: connectionString,
        },
        {
          provide: HEARTBEAT_INTERVAL,
          useValue: checkHeartBeatOnInterval,
        },
        HeartbeatService,
        ESDBConnectionService,
      ],
      exports: [ESDBConnectionService],
    };
  }
}

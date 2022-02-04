import { DynamicModule, Global, Module } from '@nestjs/common';
import { ESDBConnectionService } from './connection-initializer';
import { ProjectionUpserterService } from './projections';
import { PersistentSubscriptionService } from './persistent-subscription';
import { CONNECTION_STRING, HEARTBEAT_INTERVAL } from '../misc/constants';
import { HeartbeatService } from './heartbeat';

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

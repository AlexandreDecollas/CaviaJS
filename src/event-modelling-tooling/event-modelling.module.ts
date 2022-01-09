import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventbusModule } from './eventbus/eventbus.module';
import { EventStoreConnectorModule } from './eventstore-connector/event-store-connector.module';
import { DiscoveryModule } from '@nestjs/core';
import { EventModellingConfiguration } from './event-modelling.configuration';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    DiscoveryModule,
  ],
})
export class EventModellingModule {
  public static forRoot(
    configuration: EventModellingConfiguration,
  ): DynamicModule {
    return {
      module: EventModellingModule,
      imports: [
        configuration.redisQueueConfiguration
          ? EventbusModule.withRedisQueue(configuration.redisQueueConfiguration)
          : EventbusModule,
        EventStoreConnectorModule.forRoot(
          configuration.eventstoreConnectionString,
          configuration.checkHeartBeatOnInterval,
        ),
      ],
    };
  }
}

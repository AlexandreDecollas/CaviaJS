import { DynamicModule, Module } from '@nestjs/common';
import { EventbusModule } from './eventbus';
import { EventStoreConnectorModule } from './eventstore-connector';
import { DiscoveryModule } from '@nestjs/core';
import { EventModellingConfiguration } from './misc/event-modelling.configuration';
import { CliModule } from './cli';
import { LoggerModule } from './misc/logger.module';

@Module({
  imports: [DiscoveryModule, CliModule, LoggerModule],
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
  public static forRootTesting(): DynamicModule {
    return {
      module: EventModellingModule,
      imports: [],
    };
  }
}

import { DynamicModule, Global, Module } from '@nestjs/common';
import { Eventbus } from './eventbus.service';
import { DiscoveryModule } from '@nestjs/core';
import { RedisQueueConfiguration } from '../event-modelling.configuration';
import { INTERNAL_EVENTS_QUEUE_CONFIGURATION } from './constants';

@Module({
  providers: [
    Eventbus,
    {
      provide: INTERNAL_EVENTS_QUEUE_CONFIGURATION,
      useValue: undefined,
    },
  ],
  imports: [DiscoveryModule],
  exports: [Eventbus],
})
@Global()
export class EventbusModule {
  public static withRedisQueue(
    redisQueueConfiguration: RedisQueueConfiguration,
  ): DynamicModule {
    return {
      module: EventbusModule,
      providers: [
        {
          provide: INTERNAL_EVENTS_QUEUE_CONFIGURATION,
          useValue: redisQueueConfiguration,
        },
      ],
    };
  }
}

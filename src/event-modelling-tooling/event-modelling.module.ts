import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventbusModule } from './eventbus/eventbus.module';
import { EventStoreConnectorModule } from './eventstore-connector/event-store-connector.module';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    EventbusModule,
    DiscoveryModule,
  ],
})
export class EventModellingModule {
  public static forRoot(connectionString: string): DynamicModule {
    return {
      module: EventModellingModule,
      imports: [EventStoreConnectorModule.forRoot(connectionString)],
    };
  }
}

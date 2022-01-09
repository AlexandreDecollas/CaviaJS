import { DynamicModule, Module } from '@nestjs/common';
import { Eventbus } from './eventbus.service';
import { EventStoreConnectorModule } from '../eventstore-connector/event-store-connector.module';

@Module({
  imports: [EventStoreConnectorModule],
})
export class EventbusModule {
  public static forRoot(): DynamicModule {
    return {
      module: EventbusModule,
      global: true,
      providers: [Eventbus],
      exports: [Eventbus],
    };
  }
}

import { DynamicModule, Module } from '@nestjs/common';
import { Eventbus } from './eventbus.service';
import { EventStoreConnectorModule } from '../eventstore-connector/event-store-connector.module';
import { InMemoryFifoService } from './in-memory-fifo/in-memory-fifo.service';
import { FIFO } from './constants';

@Module({
  imports: [EventStoreConnectorModule],
  providers: [InMemoryFifoService],
})
export class EventbusModule {
  public static getDefault(): DynamicModule {
    return {
      module: EventbusModule,
      global: true,
      providers: [
        Eventbus,
        {
          provide: FIFO,
          useClass: InMemoryFifoService,
        },
      ],
      exports: [Eventbus],
    };
  }
}

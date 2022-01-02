import { Module } from '@nestjs/common';
import { Eventbus } from './eventbus.service';
import { EventStoreConnectorModule } from '../eventstore-connector/event-store-connector.module';

@Module({
  providers: [Eventbus],
  imports: [EventStoreConnectorModule],
  exports: [Eventbus],
})
export class EventbusModule {}

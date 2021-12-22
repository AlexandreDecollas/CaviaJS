import { Module } from '@nestjs/common';
import { EventbusService } from './eventbus.service';
import { EventStoreConnectorModule } from '../eventstore-connector/event-store-connector.module';

@Module({
  providers: [EventbusService],
  imports: [EventStoreConnectorModule],
  exports: [EventbusService],
})
export class EventbusModule {}

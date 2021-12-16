import { Module } from '@nestjs/common';
import { EventbusService } from './eventbus.service';
import { ConnectionInitializerModule } from '../eventstore-connector/connection-initializer/connection-initializer.module';

@Module({
  providers: [EventbusService],
  imports: [ConnectionInitializerModule],
  exports: [EventbusService],
})
export class EventbusModule {}

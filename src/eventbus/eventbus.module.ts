import { Module } from '@nestjs/common';
import { EventbusService } from './eventbus.service';

@Module({
  providers: [EventbusService],
  exports: [EventbusService],
})
export class EventbusModule {}

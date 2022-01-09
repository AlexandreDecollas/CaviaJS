import { Global, Module } from '@nestjs/common';
import { Eventbus } from './eventbus.service';

@Module({
  providers: [Eventbus],
  exports: [Eventbus],
})
@Global()
export class EventbusModule {}

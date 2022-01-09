import { Global, Module } from '@nestjs/common';
import { Eventbus } from './eventbus.service';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  providers: [Eventbus],
  imports: [DiscoveryModule],
  exports: [Eventbus],
})
@Global()
export class EventbusModule {}

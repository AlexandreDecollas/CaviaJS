import { Module } from '@nestjs/common';
import { EventEmitterExampleModule } from './example-slice/event-emitter-example.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RegisterModule } from './features/register/register.module';
import { EventbusModule } from './eventbus/eventbus.module';

@Module({
  imports: [
    EventEmitterExampleModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    RegisterModule,
    EventbusModule,
  ],
})
export class AppModule {}

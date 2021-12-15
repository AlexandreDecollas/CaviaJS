import { Module } from '@nestjs/common';
import { EventEmitterExampleModule } from './example-slice/event-emitter-example.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RegisterModule } from './features/register/register.module';
import { EventbusModule } from './eventbus/eventbus.module';
import { AddRoomModule } from './features/add-room/add-room.module';

const features = [RegisterModule, AddRoomModule];

@Module({
  imports: [
    EventEmitterExampleModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    EventbusModule,

    ...features,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RegisterModule } from './features/register/register.module';
import { EventbusModule } from './eventbus/eventbus.module';
import { AddRoomModule } from './features/add-room/add-room.module';
import { BookRoomModule } from './features/book-room/book-room.module';
import { ConnectionInitializerModule } from './eventstore-connector/connection-initializer/connection-initializer.module';

const features = [RegisterModule, AddRoomModule, BookRoomModule];

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    EventbusModule,
    ConnectionInitializerModule,

    ...features,
  ],
})
export class AppModule {}

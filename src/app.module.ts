import { Module } from '@nestjs/common';
import { RegisterModule } from './features/register/register.module';

import { AddRoomCommand } from './features/add-room/add-room.command';
import { BookRoomCommand } from './features/book-room/book-room.command';
import { CheckInCommand } from './features/check-in/check-in.command';
import { CleaningRoomCommand } from './features/cleaning-room/cleaning-room.command';
import { HotelProximityCommand } from './features/hotel-proximity/hotel-proximity.command';
import { CheckOutCommand } from './features/check-out/check-out.command';
import { PayementRequestedModule } from './features/payement-requested/payement-requested.module';
import { PayementProcessorModule } from './features/payement-processor/payement-processor.module';
import { EventModellingModule } from './event-modelling-tooling/event-modelling.module';
import { IdGeneratorModule } from './utils/id-generator/id-generator.module';
import { LoggerModule } from './utils/logger/logger.module';

const commands = [
  RegisterModule,
  AddRoomCommand,
  BookRoomCommand,
  CleaningRoomCommand,
  CheckInCommand,
  HotelProximityCommand,
  CheckOutCommand,
  PayementRequestedModule,
  PayementProcessorModule,
];

@Module({
  imports: [
    EventModellingModule.forRoot(
      process.env.CONNECTION_STRING || 'esdb://127.0.0.1:2113?tls=false',
    ),
    IdGeneratorModule,
    LoggerModule,

    ...commands,
  ],
})
export class AppModule {}

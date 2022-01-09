import { Module } from '@nestjs/common';
import { RegisterModule } from './features/register/register.module';

import { AddRoomModule } from './features/add-room/add-room.module';
import { BookRoomModule } from './features/book-room/book-room.module';
import { CheckInModule } from './features/check-in/check-in.module';
import { CleaningRoomModule } from './features/cleaning-room/cleaning-room.module';
import { HotelProximityModule } from './features/hotel-proximity/hotel-proximity.module';
import { CheckOutModule } from './features/check-out/check-out.module';
import { PayementRequestedModule } from './features/payement-requested/payement-requested.module';
import { PayementProcessorModule } from './features/payement-processor/payement-processor.module';
import { EventModellingModule } from './event-modelling-tooling/event-modelling.module';

const features = [
  RegisterModule,
  AddRoomModule,
  BookRoomModule,
  CleaningRoomModule,
  CheckInModule,
  HotelProximityModule,
  CheckOutModule,
  PayementRequestedModule,
  PayementProcessorModule,
];

@Module({
  imports: [
    EventModellingModule.forRoot(
      process.env.CONNECTION_STRING || 'esdb://127.0.0.1:2113?tls=false',
    ),
    ...features,
  ],
})
export class AppModule {}

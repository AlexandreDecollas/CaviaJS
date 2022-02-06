import { Module } from '@nestjs/common';
import { IdGeneratorModule } from './utils/id-generator/id-generator.module';
import { EventModellingModule } from 'cavia-js';
import { HotelProximityModule } from './features/hotel-proximity/hotel-proximity.module';
import { AddRoomModule } from './features/add-room/add-room.module';
import { BookRoomModule } from './features/book-room/book-room.module';
import { CleaningRoomModule } from './features/cleaning-room/cleaning-room.module';
import { CheckOutModule } from './features/check-out/check-out.module';
import { PayementProcessorModule } from './features/payement-processor/payement-processor.module';
import { CheckInModule } from './features/check-in/check-in.module';
import { PayementRequestedModule } from './features/payement-requested/payement-requested.module';
import { RegisterModule } from './features/register/register.module';

const commandModules = [
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
    EventModellingModule.forRoot({
      checkHeartBeatOnInterval: 10_000,
      eventstoreConnectionString:
        process.env.CONNECTION_STRING ||
        'esdb://admin:changeit@127.0.0.1:2113?tls=false',
      redisQueueConfiguration: {
        queueName: 'tutu',
        options: { connection: { host: 'localhost', port: 6379 } },
      },
    }),
    IdGeneratorModule,

    ...commandModules,
  ],
})
export class AppModule {}

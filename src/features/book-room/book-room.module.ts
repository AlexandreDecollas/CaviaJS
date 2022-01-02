import { Module } from '@nestjs/common';
import { BookRoomController } from './controller/book-room.controller';
import { BookRoomService } from './services/book-room/book-room.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { provideProjection } from '../../eventstore-connector/projections/provider/projection.provider';
import { buildRoomAvailabilityProjection } from './services/projections/room-availability.projections';
import { EventbusModule } from '../../eventbus/eventbus.module';

provideProjection({
  name: 'roomAvailability',
  content: buildRoomAvailabilityProjection(),
});

@Module({
  controllers: [BookRoomController],
  imports: [EventStoreConnectorModule, EventbusModule],
  providers: [BookRoomService, IdGeneratorService],
})
export class BookRoomModule {}

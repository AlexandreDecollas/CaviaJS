import { Module } from '@nestjs/common';
import { BookRoomController } from './controller/book-room.controller';
import { BookRoomService } from './services/book-room/book-room.service';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildRoomAvailabilityProjection } from './services/projections/room-availability.projections';

provideProjection({
  name: 'roomAvailability',
  content: buildRoomAvailabilityProjection(),
});

@Module({
  controllers: [BookRoomController],
  providers: [BookRoomService],
})
export class BookRoomModule {}

import { Module } from '@nestjs/common';
import { BookRoomController } from './controller/book-room.controller';
import { BookRoomService } from './services/book-room/book-room.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { ProjectionInitializerService } from './services/projections/initializer/projection-initializer.service';

@Module({
  controllers: [BookRoomController],
  imports: [EventStoreConnectorModule],
  providers: [
    BookRoomService,
    IdGeneratorService,
    ProjectionInitializerService,
  ],
})
export class BookRoomModule {}

import { Module } from '@nestjs/common';
import { BookRoomController } from './controller/book-room.controller';
import { BookRoomService } from './services/book-room/book-room.service';
import { ConnectionInitializerModule } from '../../eventstore-connector/connection-initializer/connection-initializer.module';
import { ProjectionUpserterService } from './services/projection-upserter/projection-upserter.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';

@Module({
  controllers: [BookRoomController],
  imports: [ConnectionInitializerModule],
  providers: [BookRoomService, ProjectionUpserterService, IdGeneratorService],
})
export class BookRoomModule {}

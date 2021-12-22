import { Module } from '@nestjs/common';
import { CleaningController } from './controllers/cleaning.controller';
import { CleaningService } from './services/cleaning.service';
import { ProjectionInitializerService } from './projections/initializer/projection-initializer.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';

@Module({
  controllers: [CleaningController],
  imports: [EventStoreConnectorModule],
  providers: [
    CleaningService,
    ProjectionInitializerService,
    IdGeneratorService,
  ],
})
export class CleaningRoomModule {}

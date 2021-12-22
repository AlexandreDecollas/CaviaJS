import { Module } from '@nestjs/common';
import { CheckInController } from './controllers/check-in.controller';
import { CheckInService } from './services/check-in.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { ProjectionInitializerService } from './projections/initializer/projection-initializer.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';

@Module({
  controllers: [CheckInController],
  imports: [EventStoreConnectorModule],
  providers: [CheckInService, IdGeneratorService, ProjectionInitializerService],
})
export class CheckInModule {}

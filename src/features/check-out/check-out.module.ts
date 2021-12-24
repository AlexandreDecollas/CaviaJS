import { Module } from '@nestjs/common';
import { CheckOutController } from './controllers/check-out.controller';
import { CheckOutService } from './services/check-out.service';
import { ProjectionInitializerService } from './projections/initializer/projection-initializer.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';

@Module({
  controllers: [CheckOutController],
  imports: [EventStoreConnectorModule],
  providers: [
    CheckOutService,
    ProjectionInitializerService,
    IdGeneratorService,
  ],
})
export class CheckOutModule {}

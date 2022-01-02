import { Module } from '@nestjs/common';
import { CheckInController } from './controllers/check-in.controller';
import { CheckInService } from './services/check-in.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { provideProjection } from '../../eventstore-connector/projections/provider/projection.provider';
import { buildRegisteredGuestsProjection } from './projections/check-in.projection';

provideProjection({
  name: 'registered-guests',
  content: buildRegisteredGuestsProjection(),
});

@Module({
  controllers: [CheckInController],
  imports: [EventStoreConnectorModule],
  providers: [CheckInService, IdGeneratorService],
})
export class CheckInModule {}

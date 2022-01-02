import { Module } from '@nestjs/common';
import { CheckOutController } from './controllers/check-out.controller';
import { CheckOutService } from './services/check-out.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { EventStoreConnectorModule } from '../../eventstore-connector/event-store-connector.module';
import { provideProjection } from '../../eventstore-connector/projections/provider/projection.provider';
import { buildGuestRosterProjection } from './projections/guest-roster.projection';

provideProjection({
  name: 'guestRoster',
  content: buildGuestRosterProjection(),
});

@Module({
  controllers: [CheckOutController],
  imports: [EventStoreConnectorModule],
  providers: [CheckOutService, IdGeneratorService],
})
export class CheckOutModule {}

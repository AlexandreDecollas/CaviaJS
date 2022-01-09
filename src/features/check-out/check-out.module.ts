import { Module } from '@nestjs/common';
import { CheckOutController } from './controllers/check-out.controller';
import { CheckOutService } from './services/check-out.service';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildGuestRosterProjection } from './projections/guest-roster.projection';

provideProjection({
  name: 'guestRoster',
  content: buildGuestRosterProjection(),
});

@Module({
  controllers: [CheckOutController],
  providers: [CheckOutService],
})
export class CheckOutModule {}

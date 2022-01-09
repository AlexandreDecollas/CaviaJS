import { Module } from '@nestjs/common';
import { CheckInController } from './controllers/check-in.controller';
import { CheckInService } from './services/check-in.service';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildRegisteredGuestsProjection } from './projections/check-in.projection';

provideProjection({
  name: 'registered-guests',
  content: buildRegisteredGuestsProjection(),
});

@Module({
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}

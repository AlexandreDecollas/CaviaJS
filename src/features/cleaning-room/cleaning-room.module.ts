import { Module } from '@nestjs/common';
import { CleaningController } from './controllers/cleaning.controller';
import { CleaningService } from './services/cleaning.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildCleaningScheduleProjection } from './projections/cleaning-schedule.projection';

provideProjection({
  name: 'cleaning-schedule',
  content: buildCleaningScheduleProjection(),
});

@Module({
  controllers: [CleaningController],
  providers: [CleaningService, IdGeneratorService],
})
export class CleaningRoomModule {}

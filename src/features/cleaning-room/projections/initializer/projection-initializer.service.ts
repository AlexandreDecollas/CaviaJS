import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProjectionUpserterService } from '../../../../eventstore-connector/projection-upserter/projection-upserter.service';
import { buildCleaningScheduleProjection } from '../cleaning-schedule.projection';

@Injectable()
export class ProjectionInitializerService implements OnModuleInit {
  constructor(
    private readonly projectionUpserterService: ProjectionUpserterService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const cleaningScheduleProjection: string =
      buildCleaningScheduleProjection();
    await this.projectionUpserterService.upsertProjection(
      'cleaning-schedule',
      cleaningScheduleProjection,
    );
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProjectionUpserterService } from '../../../../eventstore-connector/projection-upserter/projection-upserter.service';
import { buildRegisteredGuestsProjection } from '../check-in.projection';

@Injectable()
export class ProjectionInitializerService implements OnModuleInit {
  constructor(
    private readonly projectionUpserterService: ProjectionUpserterService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const roomAvailabilityProjection: string =
      buildRegisteredGuestsProjection();

    await this.projectionUpserterService.upsertProjection(
      'registered-guests',
      roomAvailabilityProjection,
    );
  }
}

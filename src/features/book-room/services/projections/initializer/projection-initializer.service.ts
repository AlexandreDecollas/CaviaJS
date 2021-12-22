import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProjectionUpserterService } from '../../../../../eventstore-connector/projection-upserter/projection-upserter.service';
import { buildRoomAvailabilityProjection } from '../room-availability.projections';

@Injectable()
export class ProjectionInitializerService implements OnModuleInit {
  constructor(
    private readonly projectionUpserterService: ProjectionUpserterService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const roomAvailabilityProjection: string =
      buildRoomAvailabilityProjection();

    await this.projectionUpserterService.upsertProjection(
      'roomAvailability',
      roomAvailabilityProjection,
    );
  }
}

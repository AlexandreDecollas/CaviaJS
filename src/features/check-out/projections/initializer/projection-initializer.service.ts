import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProjectionUpserterService } from '../../../../eventstore-connector/projection-upserter/projection-upserter.service';
import { buildGuestRosterProjection } from '../guest-roster.projection';

@Injectable()
export class ProjectionInitializerService implements OnModuleInit {
  constructor(
    private readonly projectionUpserterService: ProjectionUpserterService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const checkOutProjection: string = buildGuestRosterProjection();

    await this.projectionUpserterService.upsertProjection(
      'guestRoster',
      checkOutProjection,
    );
  }
}

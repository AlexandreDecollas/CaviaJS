import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProjectionUpserterService } from '../../../../eventstore-connector/projection-upserter/projection-upserter.service';
import { buildPayementToProcessProjection } from '../payement-to-process.projection';

@Injectable()
export class ProjectionInitializerService implements OnModuleInit {
  constructor(
    private readonly projectionUpserterService: ProjectionUpserterService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const paymentsToProcessProjection: string =
      buildPayementToProcessProjection();
    await this.projectionUpserterService.upsertProjection(
      'payementsToProcess',
      paymentsToProcessProjection,
    );
  }
}

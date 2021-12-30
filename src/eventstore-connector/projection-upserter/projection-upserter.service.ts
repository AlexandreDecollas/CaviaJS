import { Injectable } from '@nestjs/common';
import { ConnectionInitializerService } from '../connection-initializer/connection-initializer.service';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class ProjectionUpserterService {
  constructor(
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  public async upsertProjection(
    name: string,
    projection: string,
  ): Promise<void> {
    const client: Client =
      this.connectionInitializerService.getConnectedClient();
    const trackEmittedStreams = projection.indexOf('emit(') !== -1;
    try {
      await client.updateProjection(name, projection, { trackEmittedStreams });
    } catch (e) {
      await client.createContinuousProjection(name, projection, {
        trackEmittedStreams,
      });
    }
  }
}

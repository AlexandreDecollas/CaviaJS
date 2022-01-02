import { Injectable, OnModuleInit } from '@nestjs/common';
import { ESDBConnectionService } from '../../connection-initializer/esdb-connection.service';
import { Client } from '@eventstore/db-client/dist/Client';
import {
  fetchProjections,
  ProvidedProjections,
} from '../provider/projection.provider';

@Injectable()
export class ProjectionUpserterService implements OnModuleInit {
  constructor(private readonly connection: ESDBConnectionService) {}

  public async onModuleInit(): Promise<void> {
    const projections: ProvidedProjections = fetchProjections();
    for (const projectionName of Object.keys(projections)) {
      console.log('Upserting projection: ', projectionName);
      await this.upsertProjection(
        projectionName,
        projections[projectionName].content,
      );
    }
  }

  public async upsertProjection(
    name: string,
    projection: string,
  ): Promise<void> {
    const client: Client = await this.connection.getConnectedClient();
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

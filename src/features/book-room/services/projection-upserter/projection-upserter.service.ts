import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConnectionInitializerService } from '../../../../eventstore-connector/connection-initializer/connection-initializer.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectionUpserterService implements OnModuleInit {
  constructor(
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  public async onModuleInit(): Promise<any> {
    const client = this.connectionInitializerService.getConnectedClient();
    const projectionPath = path.join(
      __dirname,
      '../../',
      'projections',
      'free-slot-state.projection.js',
    );
    const projection = fs.readFileSync(projectionPath, 'utf8');

    try {
      await client.updateProjection('freeSlotsState', projection);
    } catch (e) {
      await client.createContinuousProjection('freeSlotsState', projection);
    }
  }
}

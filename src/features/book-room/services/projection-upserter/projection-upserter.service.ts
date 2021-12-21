import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConnectionInitializerService } from '../../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { getRoomAvailabilityProjection } from '../projections/room-availability.projections';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class ProjectionUpserterService implements OnModuleInit {
  constructor(
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  public async onModuleInit(): Promise<any> {
    const client: Client =
      this.connectionInitializerService.getConnectedClient();
    const projection: string = getRoomAvailabilityProjection();
    try {
      await client.updateProjection('freeSlotsState', projection);
    } catch (e) {
      await client.createContinuousProjection('freeSlotsState', projection);
    }
  }
}

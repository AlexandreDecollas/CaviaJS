import { Injectable } from '@nestjs/common';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ESDBConnectionService } from '../../../event-modelling-tooling/eventstore-connector/connection-initializer/esdb-connection.service';
import { CheckInState } from '../../check-in/projections/check-in.projection';
import { RoomReadiedEvent } from '../../../model/room-readied.event';
import { Client } from '@eventstore/db-client/dist/Client';
import { Eventbus } from '../../../event-modelling-tooling/eventbus/eventbus.service';

@Injectable()
export class CleaningService {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connection: ESDBConnectionService,
  ) {}

  public async getSchedule(): Promise<CheckInState> {
    const client: Client = await this.connection.getConnectedClient();
    return client.getProjectionState('cleaning-schedule');
  }

  public readyRoom(roomNumber: number) {
    const event: RoomReadiedEvent = {
      data: {
        id: this.idGeneratorService.generateId(),
        roomNumber,
      },
      metadata: { streamName: 'manager.room-readied' },
      type: 'RoomReadiedEvent',
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}

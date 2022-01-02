import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ESDBConnectionService } from '../../../eventstore-connector/connection-initializer/esdb-connection.service';
import { CheckInState } from '../../check-in/projections/check-in.projection';
import { RoomReadiedEvent } from '../../../model/room-readied.event';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class CleaningService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
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

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { ConnectionInitializerService } from '../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { CheckInState } from '../../check-in/projections/check-in.projection';
import { RoomReadiedEvent } from '../../../model/room-readied.event';

@Injectable()
export class CleaningService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  public async getSchedule(): Promise<CheckInState> {
    return await this.connectionInitializerService
      .getConnectedClient()
      .getProjectionState('cleaning-schedule');
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

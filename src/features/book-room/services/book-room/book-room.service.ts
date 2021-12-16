import { Injectable } from '@nestjs/common';
import { ConnectionInitializerService } from '../../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomBookedEvent } from '../../../../model/room-booked.event';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';

@Injectable()
export class BookRoomService {
  constructor(
    private readonly connectionInitializerService: ConnectionInitializerService,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async checkRoomAvailability(roomNumber: number) {
    const client = this.connectionInitializerService.getConnectedClient();

    const projectionState = await client.getProjectionState('freeSlotsState');
    console.log('projectionState : ', projectionState);

    return projectionState[roomNumber];
  }

  public bookRoom(roomNumber: number, from: string, to: string) {
    const event: RoomBookedEvent = {
      metadata: { streamName: 'manager.room-booked' },
      type: 'RoomBookedEvent',
      data: {
        id: this.idGeneratorService.generateId(),
        roomNumber,
        fromDate: from,
        toDate: to,
      },
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}

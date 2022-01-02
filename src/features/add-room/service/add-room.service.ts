import { Injectable } from '@nestjs/common';
import { RoomAddedEvent } from '../../../model/room-added.event';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';
import { Eventbus } from '../../../eventbus/eventbus.service';

@Injectable()
export class AddRoomService {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public addRoom(roomNumber: number): void {
    const event: RoomAddedEvent = {
      type: 'RoomAddedEvent',
      data: {
        id: this.idGeneratorService.generateId(),
        roomNumber,
      },
      metadata: { streamName: 'manager.room-added' },
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}

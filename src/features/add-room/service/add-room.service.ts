import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomAddedEvent } from '../../../model/room-added.event';
import { IdGeneratorService } from '../../../utils/id-generator/id-generator.service';

@Injectable()
export class AddRoomService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  public registerClient(
    roomNumber: number,
    freeFromDate: string,
    freeToDate: string,
  ) {
    const event: RoomAddedEvent = {
      id: this.idGeneratorService.generateId(),
      freeFromDate,
      freeToDate,
      roomNumber,
    };
    this.eventEmitter.emit('manager.added-room', event);
  }
}

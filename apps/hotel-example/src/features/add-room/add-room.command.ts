import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { RoomAddedEvent } from '../../model/room-added.event';
import { Get, Param } from '@nestjs/common';
import { Command, Eventbus } from 'cavia-js';

@Command({
  restOptions: { path: 'add-room' },
})
export class AddRoomCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @Get('/:roomNumber')
  public addRoom(@Param('roomNumber') roomNumber: number): void {
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

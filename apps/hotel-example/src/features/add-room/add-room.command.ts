import { Command } from '../../event-modelling-tooling/command-decorators/class-decorators/command.decorator';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { RoomAddedEvent } from '../../model/room-added.event';
import { Get, Param } from '@nestjs/common';
import { CAVIA } from 'cavia-js';

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
    console.log('CAVIA : ', CAVIA);
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}

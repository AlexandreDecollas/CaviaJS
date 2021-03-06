import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { RoomAddedEvent } from '../../model/room-added.event';
import { Get, Param } from '@nestjs/common';
import { Cli, Command, Eventbus } from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

@Command({
  restOptions: { path: 'add-room' },
})
export class AddRoomCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  @Cli()
  @Get('/:roomNumber')
  @ApiParam({ name: 'roomNumber', example: 123, type: Number })
  public async addRoom(@Param('roomNumber') roomNumber: number): Promise<void> {
    const event: RoomAddedEvent = new RoomAddedEvent(
      {
        id: this.idGeneratorService.generateId(),
        roomNumber,
      },
      {},
    );
    await this.eventEmitter.emit('manager.room-added', event);
  }
}

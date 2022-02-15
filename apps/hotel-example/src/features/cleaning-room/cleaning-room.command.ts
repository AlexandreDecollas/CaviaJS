import { Get, Param } from '@nestjs/common';
import { buildCleaningScheduleProjection } from './projections/cleaning-schedule.projection';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { Client } from '@eventstore/db-client/dist/Client';
import { RoomReadiedEvent } from '../../model/room-readied.event';
import {
  Command,
  ESDBConnectionService,
  Eventbus,
  provideProjection,
} from 'cavia-js';
import { ApiParam } from '@nestjs/swagger';

provideProjection({
  name: 'cleaning-schedule',
  content: buildCleaningScheduleProjection(),
});

@Command({
  restOptions: { path: 'cleaning' },
})
export class CleaningRoomCommand {
  constructor(
    private readonly eventEmitter: Eventbus,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly connection: ESDBConnectionService,
  ) {}

  @Get('schedule')
  public async register() {
    const client: Client = await this.connection.getConnectedClient();
    return client.getProjectionState('cleaning-schedule');
  }

  @Get('ready-room/:roomNumber')
  @ApiParam({ name: 'roomNumber', example: 123, type: Number })
  public async readyRoom(@Param('roomNumber') roomNumber: number) {
    const event: RoomReadiedEvent = new RoomReadiedEvent(
      {
        id: this.idGeneratorService.generateId(),
        roomNumber,
      },
      { streamName: 'manager.room-readied' },
    );
    await this.eventEmitter.emit(event);
  }
}

import { Get, Param } from '@nestjs/common';
import { provideProjection } from '../../event-modelling-tooling/eventstore-connector/projections/provider/projection.provider';
import { buildCleaningScheduleProjection } from './projections/cleaning-schedule.projection';
import { Command } from '../../event-modelling-tooling/command-decorators/class-decorators/command.decorator';
import { Eventbus } from '../../event-modelling-tooling/eventbus/eventbus.service';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';
import { ESDBConnectionService } from '../../event-modelling-tooling/eventstore-connector/connection-initializer/esdb-connection.service';
import { Client } from '@eventstore/db-client/dist/Client';
import { RoomReadiedEvent } from '../../model/room-readied.event';

provideProjection({
  name: 'cleaning-schedule',
  content: buildCleaningScheduleProjection(),
});

@Command({
  entryPoints: { restPath: 'cleaning' },
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
  public async readyRoom(@Param('roomNumber') roomNumber: number) {
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

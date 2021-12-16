import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConnectionInitializerService } from '../../../../eventstore-connector/connection-initializer/connection-initializer.service';

@Injectable()
export class ProjectionUpserterService implements OnModuleInit {
  constructor(
    private readonly connectionInitializerService: ConnectionInitializerService,
  ) {}

  public async onModuleInit(): Promise<any> {
    const client = this.connectionInitializerService.getConnectedClient();
    const projection = `
    fromStream('manager.room-added')
  .when({
    $init: function () {
      return {
        123: [],
        209: [],
      };
    },
    RoomAddedEvent: function (state, event) {
      state[event.body.roomNumber].push([
        event.body.freeFromDate,
        event.body.freeToDate,
      ]);
    },
  })
  .outputState();
    `;

    try {
      await client.updateProjection('freeSlotsState', projection);
    } catch (e) {
      await client.createContinuousProjection('freeSlotsState', projection);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConnectionInitializerService } from '../../../../eventstore-connector/connection-initializer/connection-initializer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomBookedEvent } from '../../../../model/room-booked.event';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { BookedRoomsState } from '../projections/room-availability.projections';
import { Slot } from '../../model/slot';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Client } from '@eventstore/db-client/dist/Client';

const moment = extendMoment(Moment);

@Injectable()
export class BookRoomService {
  constructor(
    private readonly connectionInitializerService: ConnectionInitializerService,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async checkRoomAvailability(roomNumber: number): Promise<Slot[]> {
    const client: Client =
      await this.connectionInitializerService.getConnectedClient();

    const projectionState: BookedRoomsState = await client.getProjectionState(
      'roomAvailability',
    );

    return projectionState.rooms[roomNumber].slots;
  }

  public async bookRoom(roomNumber: number, from: string, to: string) {
    const client: Client =
      await this.connectionInitializerService.getConnectedClient();

    const projectionState: BookedRoomsState = await client.getProjectionState(
      'freeSlotsState',
    );

    const slots: Slot[] = projectionState.rooms[roomNumber].slots;

    slots.forEach((slot: Slot) => {
      const parsedFromNew = moment(from, 'DD-MM-YYYY');
      const parsedToNew = moment(to, 'DD-MM-YYYY');
      const rangeNew = moment.range(parsedFromNew, parsedToNew);

      const parsedFromCurrent = moment(
        `${slot.dateFrom.day}-${slot.dateFrom.month}-${slot.dateFrom.year}`,
        'DD-MM-YYYY',
      );
      const parsedToCurrent = moment(
        `${slot.dateFrom.day}-${slot.dateFrom.month}-${slot.dateFrom.year}`,
        'DD-MM-YYYY',
      );
      const rangeCurrent = moment.range(parsedFromCurrent, parsedToCurrent);

      if (rangeNew.intersect(rangeCurrent)) {
        throw new Error(`The room ${roomNumber} is used on this dates`);
      }
    });

    const event: RoomBookedEvent = {
      metadata: { streamName: 'guest.room-booked' },
      type: 'RoomBookedEvent',
      data: {
        id: this.idGeneratorService.generateId(),
        roomNumber,
        occupiedFromDate: {
          day: +from.split('-')[0],
          month: +from.split('-')[1],
          year: +from.split('-')[2],
        },
        occupiedUntilDate: {
          day: +to.split('-')[0],
          month: +to.split('-')[1],
          year: +to.split('-')[2],
        },
      },
    };
    this.eventEmitter.emit(event.metadata.streamName, event);
  }
}

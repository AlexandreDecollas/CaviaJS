import { Injectable } from '@nestjs/common';
import { RoomBookedEvent } from '../../../../model/room-booked.event';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { BookedRoomsState } from '../../projections/room-availability.projections';
import { Slot } from '../../model/slot';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Client } from '@eventstore/db-client/dist/Client';
import { Reservation } from '../../model/reservation';
import { ESDBConnectionService, Eventbus } from 'cavia-js';

const moment = extendMoment(Moment);

@Injectable()
export class BookRoomService {
  constructor(
    private readonly connection: ESDBConnectionService,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly eventEmitter: Eventbus,
  ) {}

  public async checkRoomAvailability(roomNumber: number): Promise<Slot[]> {
    const client: Client = await this.connection.getConnectedClient();

    const projectionState: BookedRoomsState = await client.getProjectionState(
      'roomAvailability',
    );

    return projectionState.rooms[roomNumber].slots;
  }

  public async bookRoom(
    reservation: Reservation,
    updateStateRequested: boolean,
  ) {
    const { roomNumber, from, to } = reservation;

    if (updateStateRequested) {
      await this.recheckDatas(roomNumber, from, to);
    }

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

  private async recheckDatas(
    roomNumber: number,
    from: string,
    to: string,
  ): Promise<void> {
    const client: Client = await this.connection.getConnectedClient();

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
  }
}

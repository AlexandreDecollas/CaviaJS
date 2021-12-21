import { RoomAddedEvent } from '../../../../model/room-added.event';
import {
  BookedRoomsState,
  roomAddedEventHandlerCallBack,
} from './room-availability.projections';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

describe('RoomAvailabilityProjection', () => {
  it('should add a room when room is added', () => {
    const state: BookedRoomsState = new BookedRoomsState();
    const event: RoomAddedEvent = {
      metadata: { streamName: 'manager.room-added' },
      type: 'RoomAddedEvent',
      data: {
        id: 'AZE',
        roomNumber: 123,
      },
    };
    roomAddedEventHandlerCallBack(state, event);
    expect(state.rooms.get(event.data.roomNumber)).toBeTruthy();
  });

  it('should merge the booked slots when possible', () => {
    const state: BookedRoomsState = new BookedRoomsState();
    const event1: RoomAddedEvent = {
      metadata: { streamName: 'manager.room-added' },
      type: 'RoomAddedEvent',
      data: {
        id: 'AZE',
        roomNumber: 123,
        occupiedFromDate: moment().subtract(10, 'days').toISOString(),
        occupiedUntilDate: moment().subtract(2, 'days').toISOString(),
      },
    };
    const event2: RoomAddedEvent = {
      metadata: { streamName: 'manager.room-added' },
      type: 'RoomAddedEvent',
      data: {
        id: 'AZE',
        roomNumber: 123,
        occupiedFromDate: moment().subtract(2, 'days').toISOString(),
        occupiedUntilDate: moment().add(2, 'days').toISOString(),
      },
    };
    const range = moment.rangeFromISOString(
      event1.data.occupiedFromDate + '/' + event2.data.occupiedUntilDate,
    );
    roomAddedEventHandlerCallBack(state, event1);
    roomAddedEventHandlerCallBack(state, event2);
    expect(state.rooms.get(123)[0]).toEqual(
      range.start.startOf('day').toISOString() +
        '/' +
        range.end.endOf('day').toISOString(),
    );
  });
});

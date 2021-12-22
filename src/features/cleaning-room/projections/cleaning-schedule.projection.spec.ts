import { RoomBookedEvent } from '../../../model/room-booked.event';
import {
  CleaningScheduleState,
  roomBookedEventCallBack,
  ScheduledRoom,
} from './cleaning-schedule.projection';

describe('CleaningScheduleProjection', () => {
  it('should show all rooms with the next date of checkout', () => {
    const state: CleaningScheduleState = new CleaningScheduleState();

    const eventA: RoomBookedEvent = {
      data: {
        id: 'hoho',
        roomNumber: 123,
        occupiedFromDate: {
          year: 2021,
          month: 12,
          day: 1,
        },
        occupiedUntilDate: {
          year: 2021,
          month: 12,
          day: 5,
        },
      },
      metadata: { streamName: 'plpl' },
      type: 'RoomBookedEvent',
    };
    const eventB: RoomBookedEvent = {
      data: {
        id: 'hoho',
        roomNumber: 123,
        occupiedFromDate: {
          year: 2021,
          month: 12,
          day: 5,
        },
        occupiedUntilDate: {
          year: 2021,
          month: 12,
          day: 6,
        },
      },
      metadata: { streamName: 'plpl' },
      type: 'RoomBookedEvent',
    };
    const eventC: RoomBookedEvent = {
      data: {
        id: 'hoho',
        roomNumber: 209,
        occupiedFromDate: {
          year: 2021,
          month: 12,
          day: 8,
        },
        occupiedUntilDate: {
          year: 2021,
          month: 12,
          day: 14,
        },
      },
      metadata: { streamName: 'plpl' },
      type: 'RoomBookedEvent',
    };
    const eventD: RoomBookedEvent = {
      data: {
        id: 'hoho',
        roomNumber: 450,
        occupiedFromDate: {
          year: 2021,
          month: 12,
          day: 20,
        },
        occupiedUntilDate: {
          year: 2021,
          month: 12,
          day: 24,
        },
      },
      metadata: { streamName: 'plpl' },
      type: 'RoomBookedEvent',
    };

    roomBookedEventCallBack(state, eventA);
    roomBookedEventCallBack(state, eventB);
    roomBookedEventCallBack(state, eventC);
    roomBookedEventCallBack(state, eventD);

    expect(state.schedule).toEqual([
      {
        roomNumber: 123,
        date: {
          year: 2021,
          month: 12,
          day: 5,
        },
      },
      {
        roomNumber: 123,
        date: {
          year: 2021,
          month: 12,
          day: 6,
        },
      },
      {
        roomNumber: 209,
        date: {
          year: 2021,
          month: 12,
          day: 14,
        },
      },
      {
        roomNumber: 450,
        date: {
          year: 2021,
          month: 12,
          day: 24,
        },
      },
    ] as ScheduledRoom[]);
  });
});

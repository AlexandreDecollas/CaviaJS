import {
  WhenFilter,
  FromStreamSelector,
  ProjectionBuilder,
  OutputStateFilter,
  InitHandler,
  EventTypeHandler,
} from 'eventstore-ts-projection-builder';
import { RoomBookedEvent, SlotDate } from '../../../model/room-booked.event';

export interface ScheduledRoom {
  roomNumber: number;
  date: SlotDate;
}

export class CleaningScheduleState {
  schedule: ScheduledRoom[] = [];
}

export const roomBookedEventCallBack = (
  state: CleaningScheduleState,
  event: RoomBookedEvent,
): void => {
  state.schedule.push({
    date: {
      year: event.data.occupiedUntilDate.year,
      month: event.data.occupiedUntilDate.month,
      day: event.data.occupiedUntilDate.day,
    },
    roomNumber: event.data.roomNumber,
  });
};

export const buildCleaningScheduleProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const checkInStateState: CleaningScheduleState = new CleaningScheduleState();

  return projectionBuilder
    .addSelector(new FromStreamSelector('guest.room-booked'))
    .addFilter(
      new WhenFilter([
        new InitHandler(checkInStateState),
        new EventTypeHandler('RoomBookedEvent', roomBookedEventCallBack),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};

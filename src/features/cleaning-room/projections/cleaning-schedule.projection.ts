import { ProjectionBuilder } from '../../../utils/projections-builder/builder/projection-builder';
import { WhenFilter } from '../../../utils/projections-builder/filters/when.filter';
import { InitHandler } from '../../../utils/projections-builder/handlers/init/standard/init.handler';
import { EventTypeHandler } from '../../../utils/projections-builder/handlers/event-type/event-type.handler';
import { OutputStateFilter } from '../../../utils/projections-builder/filters/output-state.filter';
import { RoomBookedEvent, SlotDate } from '../../../model/room-booked.event';
import { FromStreamSelector } from '../../../utils/projections-builder/selectors/from-stream.selector';

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

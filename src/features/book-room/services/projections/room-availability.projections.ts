import { ProjectionBuilder } from '../../../../utils/projections-builder/builder/projection-builder';
import { FromStreamSelector } from '../../../../utils/projections-builder/selectors/from-stream.selector';
import { WhenFilter } from '../../../../utils/projections-builder/filters/when.filter';
import { InitHandler } from '../../../../utils/projections-builder/handlers/init/standard/init.handler';
import { ProjectionState } from '../../../../utils/projections-builder/builder/projection.state';
import { EventTypeHandler } from '../../../../utils/projections-builder/handlers/event-type/event-type.handler';
import { RoomAddedEvent } from '../../../../model/room-added.event';
import { OutputStateFilter } from '../../../../utils/projections-builder/filters/output-state.filter';
import { isNil } from '@nestjs/common/utils/shared.utils';
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export class BookedRoomsState extends ProjectionState {
  rooms = new Map<number, string[]>();
}

export const roomAddedEventHandlerCallBack = (
  state: BookedRoomsState,
  event: RoomAddedEvent,
): void => {
  let room: string[] = state.rooms.get(event.data.roomNumber);
  if (isNil(room)) {
    state.rooms.set(event.data.roomNumber, []);
    room = state.rooms.get(event.data.roomNumber);
  }
  const newRange: DateRange = moment.rangeFromISOString(
    `${event.data.occupiedFromDate}/${event.data.occupiedUntilDate}`,
  );

  function mergeRanges(range: DateRange, i: number) {
    range = range.add(newRange);
    range.start = range.start.startOf('day');
    range.end = range.end.endOf('day');
    room[i] = `${range.start.toISOString()}/${range.end.toISOString()}`;
    return range;
  }

  for (let i = 0; i < room.length; i++) {
    let range: DateRange = moment.rangeFromISOString(room[i]);
    const intersect: DateRange = newRange.intersect(range);

    if (intersect !== null) {
      range = mergeRanges(range, i);
      return;
    }
  }
  const startDate: string = newRange.start.startOf('day').toISOString();
  const endDate: string = newRange.end.endOf('day').toISOString();
  room.push(`${startDate}/${endDate}`);
};

export const getRoomAvailabilityProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const bookedRoomsState: BookedRoomsState = new BookedRoomsState();

  return projectionBuilder
    .addSelector(new FromStreamSelector('manager.room-added'))
    .addFilter(
      new WhenFilter([
        new InitHandler(bookedRoomsState),
        new EventTypeHandler('RoomAddedEvent', roomAddedEventHandlerCallBack),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};

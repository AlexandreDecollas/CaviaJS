import { ProjectionBuilder } from '../../../../utils/projections-builder/builder/projection-builder';
import { WhenFilter } from '../../../../utils/projections-builder/filters/when.filter';
import { InitHandler } from '../../../../utils/projections-builder/handlers/init/standard/init.handler';
import { ProjectionState } from '../../../../utils/projections-builder/builder/projection.state';
import { EventTypeHandler } from '../../../../utils/projections-builder/handlers/event-type/event-type.handler';
import { RoomAddedEvent } from '../../../../model/room-added.event';
import { OutputStateFilter } from '../../../../utils/projections-builder/filters/output-state.filter';
import { Slot } from '../../model/slot';
import { FromStreamsSelector } from '../../../../utils/projections-builder/selectors/from-streams.selector';
import { RoomBookedEvent } from '../../../../model/room-booked.event';

export interface Room {
  roomNumber: number;
  slots: Slot[];
}

export class BookedRoomsState extends ProjectionState {
  rooms: { [key: number]: Room } = {};
}

export const roomAddedEventHandlerCallBack = (
  state: BookedRoomsState,
  event: RoomAddedEvent,
): void => {
  if (state.rooms[event.data.roomNumber] === undefined)
    state.rooms[event.data.roomNumber] = {
      slots: [],
      roomNumber: event.data.roomNumber,
    };
};

export const roomBookedEventHandlerCallBack = (
  state: BookedRoomsState,
  event: RoomBookedEvent,
): void => {
  const hasIntersect = (slotA: Slot, slotB: Slot): boolean => {
    const dateFromSlotA = dateDigitsToNumber(
      slotA.dateFrom.day,
      slotA.dateFrom.month,
      slotA.dateFrom.year,
      'start',
    );
    const dateToSlotA = dateDigitsToNumber(
      slotA.dateTo.day,
      slotA.dateTo.month,
      slotA.dateTo.year,
      'end',
    );
    const dateFromSlotB = dateDigitsToNumber(
      slotB.dateFrom.day,
      slotB.dateFrom.month,
      slotB.dateFrom.year,
      'start',
    );
    const dateToSlotB = dateDigitsToNumber(
      slotB.dateTo.day,
      slotB.dateTo.month,
      slotB.dateTo.year,
      'end',
    );
    return (
      (dateFromSlotA - dateToSlotB <= 1 && dateToSlotA - dateFromSlotB > 0) ||
      (dateFromSlotB - dateToSlotA <= 0 && dateToSlotB - dateFromSlotA > 1)
    );
  };

  const dateDigitsToNumber = (
    day: number,
    month: number,
    year: number,
    position: 'start' | 'end',
  ): number => {
    return position === 'start'
      ? new Date(year, month, day, 0, 0, 0, 0).valueOf()
      : new Date(year, month, day, 23, 59, 59, 999).valueOf();
  };

  const mergeSlots = (slotIndex: number, slot) => {
    state.rooms[event.data.roomNumber].slots[slotIndex] = {
      dateFrom: {
        year: Math.min(slot.dateFrom.year, newSlot.dateFrom.year),
        month: Math.min(slot.dateFrom.month, newSlot.dateFrom.month),
        day: Math.min(slot.dateFrom.day, newSlot.dateFrom.day),
      },
      dateTo: {
        year: Math.max(slot.dateTo.year, newSlot.dateTo.year),
        month: Math.max(slot.dateTo.month, newSlot.dateTo.month),
        day: Math.max(slot.dateTo.day, newSlot.dateTo.day),
      },
    } as Slot;
  };

  const room = state.rooms[event.data.roomNumber];
  const newSlot: Slot = {
    dateFrom: event.data.occupiedFromDate,
    dateTo: event.data.occupiedUntilDate,
  };

  for (let slotIndex = 0; slotIndex < room.slots.length; slotIndex++) {
    const slot = room.slots[slotIndex];
    if (hasIntersect(newSlot, slot)) {
      mergeSlots(slotIndex, slot);
      return;
    }
  }
  state.rooms[event.data.roomNumber].slots.push(newSlot);
};
export const buildRoomAvailabilityProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const bookedRoomsState: BookedRoomsState = new BookedRoomsState();

  return projectionBuilder
    .addSelector(
      new FromStreamsSelector(['manager.room-added', 'guest.room-booked']),
    )
    .addFilter(
      new WhenFilter([
        new InitHandler(bookedRoomsState),
        new EventTypeHandler('RoomAddedEvent', roomAddedEventHandlerCallBack),
        new EventTypeHandler('RoomBookedEvent', roomBookedEventHandlerCallBack),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};

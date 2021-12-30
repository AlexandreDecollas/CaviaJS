import { CheckedInEvent } from '../../../model/checked-in.event';
import { GuestLeftEvent } from '../../../model/guest-left.event';
import { CheckedOutEvent } from '../../../model/checked-out.event';
import {
  EventTypeHandler,
  FromStreamsSelector,
  InitHandler,
  OutputStateFilter,
  WhenFilter,
} from 'eventstore-ts-projection-builder';
import { ProjectionBuilder } from 'eventstore-ts-projection-builder';

export interface IGuestRosterState {
  roster: { [key: string]: boolean };
}

export class GuestRosterState implements IGuestRosterState {
  roster = {};
}

export const checkedInEventCallBack = (
  state: GuestRosterState,
  event: CheckedInEvent,
): void => {
  state.roster[event.data.clientName] = true;
};

export const guestLeftEventCallBack = (
  state: GuestRosterState,
  event: GuestLeftEvent,
): void => {
  state.roster[event.data.guestName] = false;
};

export const checkedOutEventCallBack = (
  state: GuestRosterState,
  event: CheckedOutEvent,
): void => {
  state.roster[event.data.clientName] = undefined;
};

export const buildGuestRosterProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const guestRosterState: GuestRosterState = new GuestRosterState();

  return projectionBuilder
    .addSelector(
      new FromStreamsSelector([
        'guest.checkin',
        'guest.checkout',
        'gps.guest-left',
      ]),
    )
    .addFilter(
      new WhenFilter([
        new InitHandler(guestRosterState),
        new EventTypeHandler('CheckedInEvent', checkedInEventCallBack),
        new EventTypeHandler('GuestLeftEvent', guestLeftEventCallBack),
        new EventTypeHandler('CheckedOutEvent', checkedOutEventCallBack),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};

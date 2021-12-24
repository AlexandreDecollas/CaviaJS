import { ProjectionBuilder } from '../../../utils/projections-builder/builder/projection-builder';
import { FromStreamsSelector } from '../../../utils/projections-builder/selectors/from-streams.selector';
import { WhenFilter } from '../../../utils/projections-builder/filters/when.filter';
import { InitHandler } from '../../../utils/projections-builder/handlers/init/standard/init.handler';
import { EventTypeHandler } from '../../../utils/projections-builder/handlers/event-type/event-type.handler';
import { OutputStateFilter } from '../../../utils/projections-builder/filters/output-state.filter';
import { CheckedInEvent } from '../../../model/checked-in.event';
import { GuestLeftEvent } from '../../../model/guest-left.event';
import { CheckedOutEvent } from '../../../model/checked-out.event';

export class GuestRosterState {
  roster: { [key: string]: boolean } = {};
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
    .addSelector(new FromStreamsSelector(['guest.checkin', 'gps.guest-left']))
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

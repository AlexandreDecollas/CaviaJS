import { RegisteredEvent } from '../../../model/registered.event';
import { ProjectionBuilder } from '../../../utils/projections-builder/builder/projection-builder';
import { FromStreamsSelector } from '../../../utils/projections-builder/selectors/from-streams.selector';
import { WhenFilter } from '../../../utils/projections-builder/filters/when.filter';
import { InitHandler } from '../../../utils/projections-builder/handlers/init/standard/init.handler';
import { EventTypeHandler } from '../../../utils/projections-builder/handlers/event-type/event-type.handler';
import { OutputStateFilter } from '../../../utils/projections-builder/filters/output-state.filter';

export class CheckInState {
  guests: string[] = [];
}

export const guestRegisteredEventCallBack = (
  state: CheckInState,
  event: RegisteredEvent,
): void => {
  for (let i = 0; i < state.guests.length; i++) {
    if (state.guests[i] === event.data.clientName) {
      return;
    }
  }
  state.guests.push(event.data.clientName);
};

export const buildRegisteredGuestsProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const checkInStateState: CheckInState = new CheckInState();

  return projectionBuilder
    .addSelector(new FromStreamsSelector(['guest.registered']))
    .addFilter(
      new WhenFilter([
        new InitHandler(checkInStateState),
        new EventTypeHandler('RegisteredEvent', guestRegisteredEventCallBack),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};

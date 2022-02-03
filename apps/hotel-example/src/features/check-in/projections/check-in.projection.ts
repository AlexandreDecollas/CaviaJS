import {
  WhenFilter,
  FromStreamsSelector,
  InitHandler,
  ProjectionBuilder,
  EventTypeHandler,
  OutputStateFilter,
} from 'eventstore-ts-projection-builder';
import { RegisteredEvent } from '../../../model/registered.event';

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

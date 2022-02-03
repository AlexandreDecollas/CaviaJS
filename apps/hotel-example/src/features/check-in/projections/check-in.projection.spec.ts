import {
  CheckInState,
  guestRegisteredEventCallBack,
} from './check-in.projection';
import { RegisteredEvent } from '../../../model/registered.event';

describe('CheckInProjection', () => {
  it('should show the presence of toto in the state', () => {
    const state: CheckInState = {
      guests: ['toto'],
    };

    const registeredEvent: RegisteredEvent = {
      metadata: { streamName: 'guest.registered' },
      type: 'RegisteredEvent',
      data: {
        id: 'ttutu',
        clientName: 'toto',
        clientSurname: 'jiji',
      },
    };

    guestRegisteredEventCallBack(state, registeredEvent);

    expect(state.guests[0]).toEqual('toto');
  });
});

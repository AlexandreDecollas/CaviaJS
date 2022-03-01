import {
  checkedInEventCallBack,
  checkedOutEventCallBack,
  guestLeftEventCallBack,
  GuestRosterState,
} from './guest-roster.projection';
import { CheckedInEvent } from '../../../model/checked-in.event';
import { GuestLeftEvent } from '../../../model/guest-left.event';
import { CheckedOutEvent } from '../../../model/checked-out.event';

describe('GuestRosterProjection', () => {
  it('should put the client in the roster when checked in', () => {
    const state: GuestRosterState = new GuestRosterState();

    const clientName = 'toto';

    const checkedInEvent: CheckedInEvent = new CheckedInEvent(
      { clientName, id: 'glgl0' },
      {},
    );

    checkedInEventCallBack(state, checkedInEvent);

    expect(state.roster[clientName]).toBeTruthy();
  });

  it('should show that client is out of the hotel temporary when checked in an went out', () => {
    const state: GuestRosterState = new GuestRosterState();

    const clientName = 'toto';

    const checkedInEvent: CheckedInEvent = new CheckedInEvent(
      { clientName, id: 'glgl0' },
      {},
    );

    const guestLeftEvent: GuestLeftEvent = new GuestLeftEvent(
      { guestName: clientName, id: 'glgl1' },
      {},
    );

    checkedInEventCallBack(state, checkedInEvent);
    guestLeftEventCallBack(state, guestLeftEvent);

    expect(state.roster[clientName]).toEqual(false);
  });

  it('should not have client in the roster when checked out', () => {
    const state: GuestRosterState = new GuestRosterState();

    const clientName = 'toto';

    const checkedInEvent: CheckedInEvent = new CheckedInEvent(
      { clientName, id: 'glgl0' },
      {},
    );

    const guestLeftEvent: GuestLeftEvent = new GuestLeftEvent(
      { guestName: clientName, id: 'glgl1' },
      {},
    );

    const checkedOutEvent: CheckedOutEvent = new CheckedOutEvent(
      { clientName, id: 'glgl1' },
      {},
    );

    checkedInEventCallBack(state, checkedInEvent);
    guestLeftEventCallBack(state, guestLeftEvent);
    checkedOutEventCallBack(state, checkedOutEvent);

    expect(state.roster[clientName]).toEqual(undefined);
  });
});

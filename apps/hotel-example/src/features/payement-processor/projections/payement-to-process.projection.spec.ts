import {
  payementRequestedEventCallback,
  payementSuccededEventCallback,
  PayementToProcessProjectionState,
} from './payement-to-process.projection';
import { PayementRequestedEvent } from '../../../model/payement-requested.event';
import { PayementSuccededEvent } from '../../../model/payement-succeded.event';

describe('PayementToProcessProjection', () => {
  it('should show payement to proccess not done when not processed', () => {
    const state = new PayementToProcessProjectionState();

    const event: PayementRequestedEvent = new PayementRequestedEvent(
      { clientName: 'toto', id: 'tutu' },
      {},
    );

    payementRequestedEventCallback(state, event);

    expect(state.payementsToProccess['toto']).toEqual(true);
  });

  it('should show payement to proccess done when processed', () => {
    const state = new PayementToProcessProjectionState();

    const payementRequestedEvent: PayementRequestedEvent =
      new PayementRequestedEvent({ clientName: 'toto', id: 'tutu' }, {});

    const payementSuccededEvent: PayementSuccededEvent =
      new PayementSuccededEvent({ clientName: 'toto', id: 'tutu' }, {});

    payementRequestedEventCallback(state, payementRequestedEvent);
    payementSuccededEventCallback(state, payementSuccededEvent);

    expect(state.payementsToProccess['toto']).toEqual(false);
  });
});

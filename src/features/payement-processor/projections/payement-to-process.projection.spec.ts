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

    const event: PayementRequestedEvent = {
      data: { clientName: 'toto', id: 'tutu' },
      metadata: { streamName: 'titi' },
      type: 'PayementRequestedEvent',
    };

    payementRequestedEventCallback(state, event);

    expect(state.payementsToProccess['toto']).toEqual(true);
  });

  it('should show payement to proccess done when processed', () => {
    const state = new PayementToProcessProjectionState();

    const payementRequestedEvent: PayementRequestedEvent = {
      data: { clientName: 'toto', id: 'tutu' },
      metadata: { streamName: 'titi' },
      type: 'PayementRequestedEvent',
    };
    const payementSuccededEvent: PayementSuccededEvent = {
      data: { clientName: 'toto', id: 'tutu' },
      metadata: { streamName: 'titi' },
      type: 'PayementSuccededEvent',
    };

    payementRequestedEventCallback(state, payementRequestedEvent);
    payementSuccededEventCallback(state, payementSuccededEvent);

    expect(state.payementsToProccess['toto']).toEqual(false);
  });
});

import { PayementRequestedEvent } from '../../../model/payement-requested.event';
import { PayementSuccededEvent } from '../../../model/payement-succeded.event';
import {
  emit,
  EventTypeHandler,
  FromStreamsSelector,
  InitHandler,
  OutputStateFilter,
  ProjectionBuilder,
  WhenFilter,
} from 'eventstore-ts-projection-builder';

export class PayementToProcessProjectionState {
  emit: true;
  payementsToProccess: { [key: string]: boolean } = {};
}

export const payementRequestedEventCallback = (
  state: PayementToProcessProjectionState,
  event: PayementRequestedEvent,
): void => {
  state.payementsToProccess[event.data.clientName] = true;
  emit(
    'processor.payements-to-process',
    'PayementRequestedEvent',
    event.data,
    event.metadata,
  );
};

export const payementSuccededEventCallback = (
  state: PayementToProcessProjectionState,
  event: PayementSuccededEvent,
): void => {
  state.payementsToProccess[event.data.clientName] = false;
};

export const buildPayementToProcessProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const payementToProcessProjectionState: PayementToProcessProjectionState =
    new PayementToProcessProjectionState();

  return projectionBuilder
    .addSelector(
      new FromStreamsSelector([
        'guest.request-payement',
        'guest.payement-succedded',
      ]),
    )
    .addFilter(
      new WhenFilter([
        new InitHandler(payementToProcessProjectionState),
        new EventTypeHandler(
          'PayementRequestedEvent',
          payementRequestedEventCallback,
        ),
        new EventTypeHandler(
          'PayementSuccededEvent',
          payementSuccededEventCallback,
        ),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};

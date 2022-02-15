import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface PayementRequestedEventData {
  id: string;
  clientName: string;
}
export class PayementRequestedEvent extends EventstoreEvent<
  PayementRequestedEventData,
  EventstoreEventMetadata
> {}

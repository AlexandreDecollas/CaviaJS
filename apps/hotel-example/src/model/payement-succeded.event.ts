import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface PayementSuccededEventData {
  id: string;
  clientName: string;
}

export class PayementSuccededEvent extends EventstoreEvent<
  PayementSuccededEventData,
  EventstoreEventMetadata
> {}

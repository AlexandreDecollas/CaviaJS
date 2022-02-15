import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface StuffEventData {
  id: string;
}

export class StuffEvent extends EventstoreEvent<
  StuffEventData,
  EventstoreEventMetadata
> {}

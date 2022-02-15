import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface CheckedInEventData {
  id: string;
  clientName: string;
}

export class CheckedInEvent extends EventstoreEvent<
  CheckedInEventData,
  EventstoreEventMetadata
> {}

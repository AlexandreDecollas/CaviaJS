import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface GuestEnteredEventData {
  id: string;
  guestName: string;
}
export class GuestEnteredEvent extends EventstoreEvent<
  GuestEnteredEventData,
  EventstoreEventMetadata
> {}

import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface GuestLeftEventData {
  id: string;
  guestName: string;
}
export class GuestLeftEvent extends EventstoreEvent<
  GuestLeftEventData,
  EventstoreEventMetadata
> {}

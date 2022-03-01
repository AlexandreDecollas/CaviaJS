import { EventstoreEvent } from 'cavia-js';

export interface GuestEnteredEventData {
  id: string;
  guestName: string;
}
export class GuestEnteredEvent extends EventstoreEvent<
  GuestEnteredEventData,
  any
> {}

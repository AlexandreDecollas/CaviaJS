import { EventstoreEvent } from 'cavia-js';

export interface GuestLeftEventData {
  id: string;
  guestName: string;
}
export class GuestLeftEvent extends EventstoreEvent<GuestLeftEventData, any> {}

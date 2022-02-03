import { EventstoreEvent } from 'cavia-js';

export interface GuestEnteredEvent extends EventstoreEvent {
  data: {
    id: string;
    guestName: string;
  };
}

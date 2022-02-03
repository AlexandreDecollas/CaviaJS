import { EventstoreEvent } from 'cavia-js';

export interface GuestLeftEvent extends EventstoreEvent {
  data: {
    id: string;
    guestName: string;
  };
}

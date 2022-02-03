import { EventstoreEvent } from './eventstoreEvent';

export interface GuestEnteredEvent extends EventstoreEvent {
  data: {
    id: string;
    guestName: string;
  };
}

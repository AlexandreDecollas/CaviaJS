import { EventstoreEvent } from './eventstoreEvent';

export interface GuestLeftEvent extends EventstoreEvent {
  data: {
    id: string;
    guestName: string;
  };
}

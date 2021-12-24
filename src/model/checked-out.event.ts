import { EventstoreEvent } from './eventstoreEvent';

export interface CheckedOutEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

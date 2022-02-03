import { EventstoreEvent } from 'cavia-js';

export interface CheckedOutEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

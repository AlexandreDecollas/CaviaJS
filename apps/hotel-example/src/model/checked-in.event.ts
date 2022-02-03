import { EventstoreEvent } from 'cavia-js';

export interface CheckedInEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

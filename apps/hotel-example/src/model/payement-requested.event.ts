import { EventstoreEvent } from 'cavia-js';

export interface PayementRequestedEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

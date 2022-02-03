import { EventstoreEvent } from 'cavia-js';

export interface PayementSuccededEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

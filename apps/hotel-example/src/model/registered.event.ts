import { EventstoreEvent } from 'cavia-js';

export interface RegisteredEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
    clientSurname: string;
  };
}

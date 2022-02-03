import { EventstoreEvent } from './eventstoreEvent';

export interface RegisteredEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
    clientSurname: string;
  };
}

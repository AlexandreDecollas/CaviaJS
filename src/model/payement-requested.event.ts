import { EventstoreEvent } from './eventstoreEvent';

export interface PayementRequestedEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

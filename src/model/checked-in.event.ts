import { EventstoreEvent } from './eventstoreEvent';

export interface CheckedInEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

import { EventstoreEvent } from './eventstoreEvent';

export interface PayementSuccededEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
  };
}

import { EventstoreEvent } from '../../model/eventstoreEvent';

export interface StuffEventData {
  id: string;
}

export interface StuffEvent extends EventstoreEvent {
  data: StuffEventData;
}

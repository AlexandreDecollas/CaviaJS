import { EventstoreEvent } from 'cavia-js';

export interface StuffEventData {
  id: string;
}

export interface StuffEvent extends EventstoreEvent {
  data: StuffEventData;
}

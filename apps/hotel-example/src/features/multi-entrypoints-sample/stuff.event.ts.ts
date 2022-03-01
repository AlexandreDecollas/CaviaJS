import { EventstoreEvent } from 'cavia-js';

export interface StuffEventData {
  id: string;
}

export class StuffEvent extends EventstoreEvent<StuffEventData, any> {}

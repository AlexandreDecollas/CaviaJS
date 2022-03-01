import { EventstoreEvent } from 'cavia-js';

export interface CheckedOutEventData {
  id: string;
  clientName: string;
}

export class CheckedOutEvent extends EventstoreEvent<
  CheckedOutEventData,
  any
> {}

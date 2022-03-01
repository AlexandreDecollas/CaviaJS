import { EventstoreEvent } from 'cavia-js';

export interface RegisteredEventData {
  id: string;
  clientName: string;
  clientSurname: string;
}

export class RegisteredEvent extends EventstoreEvent<
  RegisteredEventData,
  any
> {}

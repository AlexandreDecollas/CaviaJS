import { EventstoreEvent } from 'cavia-js';

export interface RegistrationRequestedEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
    clientSurname: string;
  };
}

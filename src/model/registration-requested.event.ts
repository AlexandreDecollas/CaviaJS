import { EventstoreEvent } from './eventstoreEvent';

export interface RegistrationRequestedEvent extends EventstoreEvent {
  data: {
    id: string;
    clientName: string;
    clientSurname: string;
  };
}

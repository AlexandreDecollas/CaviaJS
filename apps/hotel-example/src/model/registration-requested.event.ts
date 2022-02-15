import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface RegistrationRequestedEventData {
  id: string;
  clientName: string;
  clientSurname: string;
}
export class RegistrationRequestedEvent extends EventstoreEvent<
  RegistrationRequestedEventData,
  EventstoreEventMetadata
> {}

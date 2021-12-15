import { Event } from './event';

export interface RegisteredEvent extends Event {
  clientName: string;
  clientSurname: string;
}

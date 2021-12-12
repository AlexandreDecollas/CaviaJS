import { Event } from './event';

export interface RegisteredEvent extends Event {
  clientName: string;
  arrivalDate: string;
}

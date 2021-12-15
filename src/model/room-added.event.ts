import { Event } from './event';

export interface RoomAddedEvent extends Event {
  roomNumber: number;
  freeFromDate: string;
  freeToDate: string;
}

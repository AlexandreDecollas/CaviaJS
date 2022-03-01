import { EventstoreEvent } from 'cavia-js';

export interface RoomBookedEventData {
  id: string;
  roomNumber: number;
  occupiedFromDate: SlotDate;
  occupiedUntilDate: SlotDate;
}

export interface SlotDate {
  year: number;
  month: number;
  day: number;
}

export class RoomBookedEvent extends EventstoreEvent<
  RoomBookedEventData,
  any
> {}

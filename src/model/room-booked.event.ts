import { EventstoreEvent } from './eventstoreEvent';

export interface SlotDate {
  year: number;
  month: number;
  day: number;
}

export interface RoomBookedEvent extends EventstoreEvent {
  data: {
    id: string;
    roomNumber: number;
    occupiedFromDate?: SlotDate;
    occupiedUntilDate?: SlotDate;
  };
}

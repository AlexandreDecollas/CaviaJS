import { EventstoreEvent } from './eventstoreEvent';

export interface RoomBookedEvent extends EventstoreEvent {
  data: {
    id: string;
    roomNumber: number;
    fromDate: string;
    toDate: string;
  };
}

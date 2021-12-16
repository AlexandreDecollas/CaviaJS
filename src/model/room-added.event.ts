import { EventstoreEvent } from './eventstoreEvent';

export interface RoomAddedEvent extends EventstoreEvent {
  data: {
    id: string;
    roomNumber: number;
    freeFromDate: string;
    freeToDate: string;
  };
}

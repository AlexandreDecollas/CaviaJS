import { EventstoreEvent } from './eventstoreEvent';

export interface RoomAddedEvent extends EventstoreEvent {
  data: {
    id: string;
    roomNumber: number;
    occupiedFromDate?: string;
    occupiedUntilDate?: string;
  };
}

import { EventstoreEvent } from 'cavia-js';

export interface RoomAddedEvent extends EventstoreEvent {
  data: {
    id: string;
    roomNumber: number;
  };
}

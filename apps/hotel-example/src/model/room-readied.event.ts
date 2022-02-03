import { EventstoreEvent } from 'cavia-js';

export interface RoomReadiedEvent extends EventstoreEvent {
  data: {
    id: string;
    roomNumber: number;
  };
}

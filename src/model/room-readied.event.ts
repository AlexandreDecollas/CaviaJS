import { EventstoreEvent } from './eventstoreEvent';

export interface RoomReadiedEvent extends EventstoreEvent {
  data: {
    id: string;
    roomNumber: number;
  };
}

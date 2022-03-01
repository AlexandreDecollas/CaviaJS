import { EventstoreEvent } from 'cavia-js';

export interface RoomAddedEventData {
  id: string;
  roomNumber: number;
}
export class RoomAddedEvent extends EventstoreEvent<RoomAddedEventData, any> {}

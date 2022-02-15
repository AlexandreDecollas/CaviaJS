import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

export interface RoomReadiedEventData {
  id: string;
  roomNumber: number;
}

export class RoomReadiedEvent extends EventstoreEvent<
  RoomReadiedEventData,
  EventstoreEventMetadata
> {}

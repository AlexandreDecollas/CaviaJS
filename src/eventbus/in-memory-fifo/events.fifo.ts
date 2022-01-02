import { EventstoreEvent } from '../../model/eventstoreEvent';

export interface EventsFifo<E extends EventstoreEvent> {
  add(event: EventstoreEvent): void;
  getFirst(): Promise<E>;
  pop(): void;
  isEmpty(): boolean;
}

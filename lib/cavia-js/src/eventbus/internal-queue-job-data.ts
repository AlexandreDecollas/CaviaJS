import { EventstoreEvent } from 'cavia-js';

export interface InternalQueueJobData<
  Data,
  Metadata,
  EventType extends EventstoreEvent<Data, Metadata>,
> {
  event: EventType;
  streamName: string;
}

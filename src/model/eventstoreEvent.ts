export abstract class EventstoreEvent {
  version?: number;
  data: any;
  metadata: {
    streamName: string;
  };
  type: string;
}

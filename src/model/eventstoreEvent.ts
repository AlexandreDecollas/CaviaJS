export interface EventstoreEvent {
  version?: number;
  data: any;
  metadata: {
    streamName: string;
  };
  type: string;
}

export interface EventstoreEvent {
  data: any;
  metadata: {
    streamName: string;
  };
  type: string;
}

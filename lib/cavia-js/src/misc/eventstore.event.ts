export interface EventstoreEventMetadata {
  streamName: string;
}

export abstract class EventstoreEvent<
  Data,
  Metadata extends EventstoreEventMetadata,
> {
  constructor(
    protected readonly _data: Data,
    protected readonly _metadata: Metadata,
    protected readonly _version?: number,
  ) {}

  public get version(): number {
    return this._version;
  }

  public get data(): any {
    return this._data;
  }

  public get metadata(): EventstoreEventMetadata {
    return this._metadata;
  }
}

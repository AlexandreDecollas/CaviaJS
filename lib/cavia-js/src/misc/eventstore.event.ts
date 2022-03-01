export abstract class EventstoreEvent<Data, Metadata> {
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
  public get type(): any {
    return this.constructor.name.replace(/Event$/, '');
  }

  public get metadata(): Metadata {
    return this._metadata;
  }
}

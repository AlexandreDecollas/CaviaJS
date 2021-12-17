export interface Selector {
  toString(): string;
}

export class FromCategorySelector implements Selector {
  constructor(private readonly category: string) {}

  public toString(): string {
    return `fromCategory(${this.category})`;
  }
}

export class FromAllSelector implements Selector {
  public toString(): string {
    return `fromAll()`;
  }
}

export class FromStreamSelector implements Selector {
  constructor(private readonly streamId: string) {}
  public toString(): string {
    return `fromStream(${this.streamId})`;
  }
}

export class FromStreamsSelector implements Selector {
  constructor(private readonly streams: string[]) {}
  public toString(): string {
    return `fromStreams(${this.streams.join(', ')})`;
  }
}

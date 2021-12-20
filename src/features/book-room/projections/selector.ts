export class FromCategorySelector {
  constructor(private readonly category: string) {}

  public toString(): string {
    return `fromCategory(${this.category})`;
  }
}

export class FromAllSelector {
  public toString(): string {
    return `fromAll()`;
  }
}

export class FromStreamSelector {
  constructor(private readonly streamId: string) {}
  public toString(): string {
    return `fromStream(${this.streamId})`;
  }
}

export class FromStreamsSelector {
  constructor(private readonly streams: string[]) {}
  public toString(): string {
    return `fromStreams(${this.streams.join(', ')})`;
  }
}

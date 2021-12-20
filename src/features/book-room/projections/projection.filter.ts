export class WhenFilter {
  constructor(private readonly handlers: any[]) {}

  public toString(): string {
    const stringBuilder: string[] = [`.when({`];
    stringBuilder.push(`})`);
    return stringBuilder.join('');
  }
}

export class ForEachStreamFilter {
  public toString(): string {
    return `.foreachStream()`;
  }
}

export class OutputStateFilter {
  public toString(): string {
    return `.outputState()`;
  }
}

export class PartitionByFilter {
  private readonly callback: (event: any) => any;

  constructor(callBack: (event: any) => any) {
    this.callback = callBack;
  }

  public toString(): string {
    return `.partitionBy(${String(this.callback)})`;
  }
}

export class TransformByFilter {
  private readonly callback: (state: any) => any;

  constructor(callBack: (state: any) => any) {
    this.callback = callBack;
  }

  public toString(): string {
    return `.transformBy(${String(this.callback)})`;
  }
}

export class FilterByFilter {
  private readonly callback: (state: any) => any;

  constructor(callBack: (state: any) => any) {
    this.callback = callBack;
  }

  public toString(): string {
    return `.filterBy(${String(this.callback)})`;
  }
}

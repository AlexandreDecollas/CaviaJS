import { format } from 'prettier';

export class InitSharedHandler<S> {
  private readonly state: S;

  constructor(state: S) {
    this.state = state;
  }

  public toString(): string {
    const strState = `{$initShared:function f(){return ${String(
      this.state.toString(),
    )}}}`;
    return format(strState, { parser: 'typescript' });
  }
}

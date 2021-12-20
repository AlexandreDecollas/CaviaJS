import { format } from 'prettier';

export class InitHandler<T> {
  private readonly state: T;

  constructor(state: T) {
    this.state = state;
  }

  public toString(): string {
    const strState = `{$init:function f(){return ${String(
      this.state.toString(),
    )}}}`;
    return format(strState, { parser: 'typescript' });
  }
}

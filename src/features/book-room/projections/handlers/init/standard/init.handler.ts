import { format } from 'prettier';

export class InitHandler<S> {
  private callback = `{$init: function f() {return ${JSON.stringify(
    this.state,
  )}}}`;

  constructor(private readonly state: S) {
    this.state = state;
  }

  public toString(): string {
    return format(this.callback, { parser: 'typescript' });
  }
}

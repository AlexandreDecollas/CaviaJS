import { InitHandler } from './init.handler';
import { format } from 'prettier';

class ProjectionState {
  public toString(): string {
    return JSON.stringify(this);
  }
}

class InitialiState extends ProjectionState {
  prop1 = 'toto';
  cpt = 0;
}

describe('InitHandler', () => {
  const initialState: InitialiState = new InitialiState();
  const handler: InitHandler<InitialiState> = new InitHandler<InitialiState>(
    initialState,
  );
  it('should be able to print the initial state given at startup', () => {
    const callback = `function f() {return${JSON.stringify(initialState)}}`;
    expect(handler.toString()).toEqual(
      format(`{$init: ${callback}}`, {
        parser: 'typescript',
      }),
    );
  });
});

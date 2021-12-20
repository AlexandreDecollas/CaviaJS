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
  const handler: InitHandler<InitialiState> = new InitHandler<InitialiState>(
    new InitialiState(),
  );
  it('should be able to print the initial state given at startup', () => {
    expect(handler.toString()).toEqual(
      format(`{$init:function f(){return {prop1: 'toto',cpt: 0,}}}`, {
        parser: 'typescript',
      }),
    );
  });
});

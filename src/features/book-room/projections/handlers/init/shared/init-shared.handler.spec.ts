import { format } from 'prettier';
import { InitSharedHandler } from './init-shared.handler';
import { ProjectionState } from '../../../projection.state';

class InitialiState extends ProjectionState {
  prop1 = 'toto';
  cpt = 0;
}

describe('InitSharedHandler', () => {
  const handler: InitSharedHandler<InitialiState> =
    new InitSharedHandler<InitialiState>(new InitialiState());
  it('should be able to print the initial state given at startup', () => {
    expect(handler.toString()).toEqual(
      format(`{$initShared:function f(){return {prop1: 'toto',cpt: 0,}}}`, {
        parser: 'typescript',
      }),
    );
  });
});

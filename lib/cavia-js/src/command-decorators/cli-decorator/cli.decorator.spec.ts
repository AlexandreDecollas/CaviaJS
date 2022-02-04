import { Command } from 'cavia-js';
import { Cli } from './cli.decorator';
import { NoUniqCliEntryPointError } from './no-uniq-cli-entry-point.error';

describe('Cli decorator', () => {
  it('should throw an error when another Cli entry point method exists on the class', () => {
    try {
      @Command({})
      class CommandToto {
        @Cli()
        public toto() {
          return 123;
        }

        @Cli()
        public tutu() {
          return 444;
        }
      }
    } catch (e) {
      expect(e).toEqual(new NoUniqCliEntryPointError());
    }
  });
});

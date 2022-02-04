import { Cli, Command, EventModellingModule } from 'cavia-js';
import { CaviaCli } from './cavia.cli';
import { Module } from '@nestjs/common';
import { IdGeneratorModule } from '../../../../apps/hotel-example/src/utils/id-generator/id-generator.module';
import { LoggerModule } from '../../../../apps/hotel-example/src/utils/logger/logger.module';
import spyOn = jest.spyOn;

@Command({})
class Command1 {}

const command2Spy = jest.fn();
@Command({})
class Command2 {
  @Cli()
  toto() {
    command2Spy();
    return 123;
  }
}

@Command({})
class Command3 {}

@Module({
  imports: [
    EventModellingModule.forRootTesting(),
    IdGeneratorModule,
    LoggerModule,

    Command1,
    Command2,
    Command3,
  ],
})
class TotoModule {}

describe('CaviaCli', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    spyOn(process, 'exit').mockImplementationOnce(() => null as never);
    spyOn(console, 'log').mockImplementationOnce(() => null);
  });

  it('should return the list of the given commands', async () => {
    await runCli(['-l']);

    expect(console.log).toHaveBeenCalledWith(`Command1, Command2, Command3`);
  });

  it('should return return true when the command has a cli entry point', async () => {
    await runCli(['-ce', 'Command2']);

    expect(console.log).toHaveBeenCalledWith(true);
  });

  it('should print an error when no option is given', async () => {
    await runCli(['po']);

    expect(console.log).toHaveBeenCalledWith(
      'No or unknown option is given, do nothing...',
    );
  });

  it('should run the given command on its entry point', async () => {
    await runCli(['-c', 'Command2']);

    expect(command2Spy).toHaveBeenCalled();
  });
});

const runCli = async (args: string[]): Promise<void> => {
  await CaviaCli.run(TotoModule, args);
};

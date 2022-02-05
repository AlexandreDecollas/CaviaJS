import {
  CaviaCli,
  Cli,
  CLI_BAD_OPTION_MESSAGE,
  CLI_HELP_MESSAGE,
  Command,
  EventModellingModule,
} from 'cavia-js';
import { Module } from '@nestjs/common';
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

const command3Spy = jest.fn();
@Command({})
class Command3 {
  @Cli()
  toto(cpt: number) {
    command3Spy(cpt);
  }
}

const command4Spy = jest.fn();
@Command({})
class Command4 {
  @Cli()
  toto(val: number, dto: any) {
    console.log('val--> : ', val);
    console.log('dto--> : ', dto);
    command4Spy(val, dto);
  }
}

@Module({
  imports: [
    EventModellingModule.forRootTesting(),

    Command1,
    Command2,
    Command3,
    Command4,
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

    expect(console.log).toHaveBeenCalledWith(
      `Command1, Command2, Command3, Command4`,
    );
  });

  it('should return return true when the command has a cli entry point', async () => {
    await runCli(['-ce', 'Command2']);

    expect(console.log).toHaveBeenCalledWith(true);
  });

  it('should print an error when no option is given', async () => {
    await runCli(['unknown']);

    expect(console.log).toHaveBeenCalledWith(CLI_BAD_OPTION_MESSAGE);
  });

  it('should print a doc when command -h is used', async () => {
    await runCli(['-h']);

    expect(console.log).toHaveBeenCalledWith(CLI_HELP_MESSAGE);
  });

  it('should run the given command on its entry point', async () => {
    await runCli(['-c', 'Command2']);

    expect(command2Spy).toHaveBeenCalled();
  });

  it('should run the command and pass 123 in parameter', async () => {
    await runCli(['-c', 'Command3', '-p', '123']);

    expect(command3Spy).toHaveBeenCalledWith('123');
  });

  it('should run the command and pass the object and number in parameter', async () => {
    const dto = {
      toto: { eee: 123 },
      id: '4567',
    };
    const val = 999;
    await runCli([
      '-c',
      'Command4',
      '-p',
      JSON.stringify(dto),
      '-p',
      JSON.stringify(val),
    ]);

    expect(JSON.parse(command4Spy.mock.calls[0][0])).toEqual(dto);
    expect(JSON.parse(command4Spy.mock.calls[0][1])).toEqual(val);
  });
});

const runCli = async (args: string[]): Promise<void> => {
  await CaviaCli.run(TotoModule, args);
};

import { Test, TestingModule } from '@nestjs/testing';
import { Cli, CliService, Command } from 'cavia-js';
import { DiscoveryService } from '@nestjs/core';

const commandSpy = jest.fn();

@Command({})
class Command1 {
  @Cli()
  public toto() {
    commandSpy();
    return 123;
  }
}

@Command({})
class Command2 {}

@Command({})
class Command3 {}

describe('CliService', () => {
  let service: CliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CliService, DiscoveryService],
      imports: [Command1, Command2, Command3],
    }).compile();

    service = module.get<CliService>(CliService);
  });

  it('should list all the commands imported in the module', () => {
    const list: string[] = service.listAllCommands();
    expect(list).toEqual(['Command1', 'Command2', 'Command3']);
  });

  it('should return true when a command has a cli entry point method', () => {
    const entryPointMethod: boolean = service.hasEntryPointMethod('Command1');
    expect(entryPointMethod).toEqual(true);
  });

  it('should return false when a command do not have cli entry point', () => {
    const entryPointMethod: boolean = service.hasEntryPointMethod('Command2');
    expect(entryPointMethod).toEqual(false);
  });

  it('should run the command on its entryPoint', async () => {
    await service.runCommand('Command1');

    expect(commandSpy).toHaveBeenCalled();
  });
});

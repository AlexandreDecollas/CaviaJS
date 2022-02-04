import { Test, TestingModule } from '@nestjs/testing';
import { CliService } from './cli.service';
import { Command } from 'cavia-js';
import { DiscoveryService } from '@nestjs/core';

const Cli = (): MethodDecorator => {
  return (target: any, key: string | symbol): void => {
    Reflect.defineMetadata('cli-entry-point', key, target);
  };
};

@Command({})
class Command1 {
  @Cli()
  public toto() {
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
    const entryPointMethod: boolean = service.hasEntryPointMethod(Command1);
    expect(entryPointMethod).toEqual(true);
  });

  it('should return false when a command do not have cli entry point', () => {
    const entryPointMethod: boolean = service.hasEntryPointMethod(Command2);
    expect(entryPointMethod).toEqual(false);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CliService } from './cli.service';
import { Command } from 'cavia-js';
import { DiscoveryService } from '@nestjs/core';

@Command({})
class Command1 {}

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

  it('list all the commands imported in the module', () => {
    const list: string[] = service.listAllCommands();
    expect(list).toEqual(['Command1', 'Command2', 'Command3']);
  });
});

import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { CLI_ENTRY_POINT_METADATA } from '../../command-decorators/cli-decorator';

@Injectable()
export class CliService {
  constructor(private readonly discoveryService: DiscoveryService) {}

  public listAllCommands(): string[] {
    const instantiatedCommands: InstanceWrapper[] =
      this.discoveryService.getControllers();
    return instantiatedCommands.map((instance: InstanceWrapper) => {
      return instance.name;
    });
  }

  public hasEntryPointMethod(command: string): boolean {
    const instantiatedCommands: InstanceWrapper[] =
      this.discoveryService.getControllers();

    const commandInstance: InstanceWrapper = instantiatedCommands.filter(
      (instance: InstanceWrapper) => {
        return instance.name === command;
      },
    )[0];

    const cliEntryPoint: string = Reflect.getMetadata(
      CLI_ENTRY_POINT_METADATA,
      commandInstance.instance,
    );
    return cliEntryPoint !== undefined;
  }

  public async runCommand(commandName: string, ...args: any): Promise<void> {
    const instantiatedCommands: InstanceWrapper[] =
      this.discoveryService.getControllers();

    const commandInstance: InstanceWrapper = instantiatedCommands.filter(
      (instance: InstanceWrapper) => {
        return instance.name === commandName;
      },
    )[0];

    const cliEntryPoint: string = Reflect.getMetadata(
      CLI_ENTRY_POINT_METADATA,
      commandInstance.instance,
    );
    await commandInstance.instance[cliEntryPoint](...args);
  }
}

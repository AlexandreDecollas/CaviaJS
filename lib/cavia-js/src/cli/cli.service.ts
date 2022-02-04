import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

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
}

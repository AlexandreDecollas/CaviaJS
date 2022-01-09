import { ModuleMetadata } from '@nestjs/common';

export interface SubscribedPersub {
  name: string;
}

export interface CommandMetadata extends ModuleMetadata {
  entryPoint?: string;
  onPersubEvent?: SubscribedPersub;
}

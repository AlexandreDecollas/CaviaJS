import { ModuleMetadata } from '@nestjs/common';

export interface CommandEntryPoint {
  restPath?: string;
  persubName?: string;
}

export interface CommandMetadata extends ModuleMetadata {
  entryPoint?: CommandEntryPoint;
}

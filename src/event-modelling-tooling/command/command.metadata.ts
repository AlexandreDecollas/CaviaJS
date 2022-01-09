import { ModuleMetadata } from '@nestjs/common';

export interface CommandMetadata extends ModuleMetadata {
  entryPoint?: string;
}

import { ModuleMetadata } from '@nestjs/common';
import { RedisQueueConfiguration } from '../event-modelling.configuration';

export interface CommandEntryPoint {
  restPath?: string;
  persubName?: string;
  externalEventQueue?: RedisQueueConfiguration;
}

export interface CommandMetadata extends ModuleMetadata {
  entryPoint?: CommandEntryPoint;
}

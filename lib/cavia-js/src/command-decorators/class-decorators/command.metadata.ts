import { ModuleMetadata } from '@nestjs/common';
import { RedisQueueConfiguration } from '../../misc/event-modelling.configuration';
import { ControllerOptions } from '@nestjs/common/decorators/core/controller.decorator';

export interface CommandMetadata extends ModuleMetadata {
  restOptions?: ControllerOptions;
  persubName?: string;
  externalEventQueue?: RedisQueueConfiguration;
}

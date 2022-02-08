import { RedisQueueConfiguration } from '../../misc/event-modelling.configuration';
import { ControllerOptions } from '@nestjs/common/decorators/core/controller.decorator';

export interface CommandMetadata {
  restOptions?: ControllerOptions;
  persubName?: string;
  externalEventQueue?: RedisQueueConfiguration;
}

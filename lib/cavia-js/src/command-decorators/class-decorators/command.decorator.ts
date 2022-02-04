import { Controller, Module, Type } from '@nestjs/common';
import { CommandMetadata } from './command.metadata';
import {
  EXTERNAL_EVENT_HOOK_METADATA,
  PERSUB_HOOK_METADATA,
} from '../../misc/constants';

export function Command(metadata: CommandMetadata): ClassDecorator {
  return (target: object) => {
    if (metadata.persubName) {
      Reflect.defineMetadata(PERSUB_HOOK_METADATA, metadata.persubName, target);
    }
    if (metadata.externalEventQueue) {
      Reflect.defineMetadata(
        EXTERNAL_EVENT_HOOK_METADATA,
        metadata.externalEventQueue,
        target,
      );
    }
    Controller({ path: metadata.restOptions?.path ?? '' })(target as any);

    Module({
      providers: metadata.providers,
      imports: metadata.imports,
      exports: metadata.exports,
      controllers: [...(metadata.controllers ?? []), target as Type<any>],
    })(target as any);
  };
}

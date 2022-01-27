import { Controller, Module, Type } from '@nestjs/common';
import { CommandMetadata } from './command.metadata';
import {
  PERSUB_HOOK_METADATA,
  EXTERNAL_EVENT_HOOK_METADATA,
} from '../../constants';

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
    Controller({ path: metadata.restOptions.path })(target as any);

    Module({
      providers: metadata.providers,
      imports: metadata.imports,
      exports: metadata.exports,
      controllers: [...(metadata.controllers ?? []), target as Type<any>],
    })(target as any);
  };
}

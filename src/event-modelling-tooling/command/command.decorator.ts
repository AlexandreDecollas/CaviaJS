import { Controller, Module, Type } from '@nestjs/common';
import { CommandMetadata } from './command.metadata';

export function Command(metadata: CommandMetadata): ClassDecorator {
  return (target: object) => {
    Controller({ path: metadata.entryPoint })(target as any);

    Module({
      providers: metadata.providers,
      imports: metadata.imports,
      exports: metadata.exports,
      controllers: [...(metadata.controllers ?? []), target as Type<any>],
    })(target as any);
  };
}

import { NoUniqCliEntryPointError } from './no-uniq-cli-entry-point.error';
import { CLI_ENTRY_POINT_METADATA } from './constants';

export const Cli = (): MethodDecorator => {
  return (target: any, key: string | symbol): void => {
    const otherCliEntryPoint = Reflect.getMetadata(
      CLI_ENTRY_POINT_METADATA,
      target,
    );

    if (otherCliEntryPoint !== undefined) {
      throw new NoUniqCliEntryPointError();
    }
    Reflect.defineMetadata(CLI_ENTRY_POINT_METADATA, key, target);
  };
};

import { EXTERNAL_EVENT_HOOK } from '../../constants';

export const ExternalEventHook = (target: any, key: string | symbol): void => {
  Reflect.defineMetadata(EXTERNAL_EVENT_HOOK, key, target);
};

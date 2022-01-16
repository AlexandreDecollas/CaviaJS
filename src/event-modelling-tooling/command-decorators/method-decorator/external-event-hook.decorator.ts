import { REDIS_EVENT_HOOK } from '../../constants';

export const ExternalEventHook = (target: any, key: string | symbol): void => {
  Reflect.defineMetadata(REDIS_EVENT_HOOK, key, target);
};

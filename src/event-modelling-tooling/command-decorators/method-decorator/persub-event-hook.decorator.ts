import { PERSUB_EVENT_HOOK } from '../../constants';

export const PersubEventHook = (target: any, key: string | symbol): void => {
  Reflect.defineMetadata(PERSUB_EVENT_HOOK, key, target);
};

import { ANY_EVENT, PERSUB_EVENT_HOOK } from '../../constants';

export interface PersubHookMetadata {
  method: string | symbol;
  allowedEventType: string;
}

export const PersubEventHook = (eventType?: object): MethodDecorator => {
  return (target: any, key: string | symbol): void => {
    let metadatas: PersubHookMetadata[] = Reflect.getMetadata(
      PERSUB_EVENT_HOOK,
      target,
    );

    metadatas = metadatas ?? [];
    metadatas.push({
      method: key,
      allowedEventType: (eventType as any)?.name ?? ANY_EVENT,
    });
    Reflect.defineMetadata(PERSUB_EVENT_HOOK, metadatas, target);
  };
};

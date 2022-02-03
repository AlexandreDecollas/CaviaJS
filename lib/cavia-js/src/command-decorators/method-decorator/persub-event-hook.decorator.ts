import { PERSUB_EVENT_HOOK } from '../../constants';

export interface PersubHookMetadata {
  method: string | symbol;
  allowedEventTypes: string[];
  sequenceState: { [key: string]: boolean };
}

export const PersubEventHook = (
  eventTypeSequence: object[] = [],
): MethodDecorator => {
  return (target: any, key: string | symbol): void => {
    let metadatas: PersubHookMetadata[] = Reflect.getMetadata(
      PERSUB_EVENT_HOOK,
      target,
    );

    metadatas = metadatas ?? [];
    metadatas.push({
      method: key,
      allowedEventTypes: eventTypeSequence.map(
        (eventType): string => (eventType as any).name,
      ),
      sequenceState: {},
    });
    Reflect.defineMetadata(PERSUB_EVENT_HOOK, metadatas, target);
  };
};

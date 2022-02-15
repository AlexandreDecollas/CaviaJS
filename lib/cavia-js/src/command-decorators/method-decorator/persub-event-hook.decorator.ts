import { SAGA_HOOK } from '../../misc/constants';

export interface PersubHookMetadata {
  method: string | symbol;
  allowedEventTypes: string[];
  sequenceState: { [key: string]: boolean };
}

export const SingleEventHook = (eventType: object): MethodDecorator =>
  Saga([eventType]);

export const AllEventsHook = (): MethodDecorator => Saga([]);

export const Saga = (eventTypeSequence: object[] = []): MethodDecorator => {
  return (target: any, key: string | symbol): void => {
    let metadatas: PersubHookMetadata[] = Reflect.getMetadata(
      SAGA_HOOK,
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
    Reflect.defineMetadata(SAGA_HOOK, metadatas, target);
  };
};

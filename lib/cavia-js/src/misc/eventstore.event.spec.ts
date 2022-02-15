import { EventstoreEvent, EventstoreEventMetadata } from 'cavia-js';

describe('EventstoreEvent', () => {
  it(`should automatically set the type to constructor name whitout word 'Event'`, () => {
    class TotoEvent extends EventstoreEvent<any, EventstoreEventMetadata> {}

    const totoEvent = new TotoEvent({}, { streamName: 'tt' });

    expect(totoEvent.type).toEqual('Toto');
  });

  it(`should only replace the word 'Event' in the type when it's on the end`, () => {
    class TotoEventlyEvent extends EventstoreEvent<
      any,
      EventstoreEventMetadata
    > {}

    const totoEventlyEvent = new TotoEventlyEvent({}, { streamName: 'tt' });

    expect(totoEventlyEvent.type).toEqual('TotoEvently');
  });
});

import { ProjectionBuilder } from './projection-builder';
import {
  FromAllSelector,
  FromCategorySelector,
  FromStreamSelector,
  FromStreamsSelector,
} from './Selector';
import { ProjectionOptions } from './projection.options';

describe('ProjectionBuilder', () => {
  let builder: ProjectionBuilder;

  const options: ProjectionOptions = new ProjectionOptions({
    resultStreamName: 'ijiji',
    $includeLinks: true,
    processingLag: 1000,
    reorderEvents: true,
  });

  const forInfo = `fromStream('manager.room-added')
  .when({
    $init: function () {
      return {
        123: [],
        209: [],
      };
    },
    RoomAddedEvent: function (state, event) {
      state[event.body.roomNumber].push([
        event.body.freeFromDate,
        event.body.freeToDate,
      ]);
    },
  })
  .outputState();`;

  beforeEach(() => {
    builder = new ProjectionBuilder();
  });

  it('should add the given option before the projection when exporting', () => {
    builder = builder.addOptions(options);
    expect(builder.exportProjection()).toEqual(`options({
      resultStreamName: 'ijiji',
      $includeLinks: true,
      processingLag: 1000,
      reorderEvents: true,
    })\n\n`);
  });

  it('should show fromAll selector when exporting', () => {
    const selector: FromAllSelector = new FromAllSelector();
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(`fromAll()`);
  });

  it('should show fromCategory selector whith category argument when exporting', () => {
    const selector: FromCategorySelector = new FromCategorySelector('test');
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(`fromCategory(test)`);
  });

  it('should show fromStream selector with streamId when exporting', () => {
    const selector: FromStreamSelector = new FromStreamSelector('test');
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(`fromStream(test)`);
  });

  it('should show fromStreams selector with streams when exporting', () => {
    const selector: FromStreamsSelector = new FromStreamsSelector([
      'test1',
      'test2',
      'test3',
    ]);
    builder = builder.addSelector(selector);
    expect(builder.exportProjection()).toEqual(
      `fromStreams(test1, test2, test3)`,
    );
  });

  it('should be able to chain the constructor tool for adding options and selector', () => {
    builder = builder.addSelector(new FromAllSelector()).addOptions(options);

    expect(builder.exportProjection()).toEqual(`options({
      resultStreamName: 'ijiji',
      $includeLinks: true,
      processingLag: 1000,
      reorderEvents: true,
    })\n\n\nfromAll()`);
  });
});

import { ProjectionBuilder } from './projection-builder';
import {
  FromAllSelector,
  FromCategorySelector,
  FromStreamSelector,
  FromStreamsSelector,
} from './Selector';
import { ProjectionOptions } from './projection.options';
import {
  FilterByFilter,
  OutputStateFilter,
  PartitionByFilter,
  TransformByFilter,
  WhenFilter,
} from './projection.filter';
import { format } from 'prettier';

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
    expect(builder.exportProjection()).toEqual(
      tsFormat(
        `options({resultStreamName: 'ijiji',$includeLinks: true,processingLag: 1000,reorderEvents: true,})`,
      ),
    );
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

  it('should be able to chain outputState filter when building a projection', () => {
    builder = builder.addSelector(new FromAllSelector()).addOptions(options);

    expect(builder.exportProjection()).toEqual(
      `${format(
        `options({resultStreamName: 'ijiji',$includeLinks: true,processingLag: 1000,reorderEvents: true,})`,
        { parser: 'typescript' },
      )}fromAll()`,
    );
  });

  it('should be able to chain a when filter when building a projection', () => {
    const projection: string = builder
      .addSelector(new FromAllSelector())
      .addFilter(new WhenFilter([]))
      .exportProjection();

    expect(projection).toEqual(`fromAll().when({})`);
  });

  it('should be able to chain a foreachStream filter when building a projection', () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new OutputStateFilter())
      .exportProjection();

    expect(projection).toEqual(`fromAll().outputState()`);
  });

  it('should be able to chain a partitionBy filter when building a projection$', () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new PartitionByFilter((event) => null))
      .exportProjection();

    expect(projection).toEqual(`fromAll().partitionBy((event) => null)`);
  });

  it('should be able to chain a transformBy filter when building a projection$', () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new TransformByFilter((state) => null))
      .exportProjection();

    expect(projection).toEqual(`fromAll().transformBy((state) => null)`);
  });

  it('should be able to chain a filterBy filter when building a projection$', () => {
    const projection = builder
      .addSelector(new FromAllSelector())
      .addFilter(new FilterByFilter((state) => null))
      .exportProjection();

    expect(projection).toEqual(`fromAll().filterBy((state) => null)`);
  });
});

const tsFormat = (rawStr) => format(rawStr, { parser: 'typescript' });

import { ProjectionBuilder } from './projection-builder';
import { BuilderInterface } from './builder.interface';

describe('ProjectionBuilder', () => {
  let builder: ProjectionBuilder;

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

  it('should be created', () => {
    expect(builder).toBeTruthy();
  });
  [
    { name: 'fromAll' },
    { name: 'fromCategory', category: 'string' },
    'fromStream',
    'fromStreams',
  ].forEach((selector: any) => {
    it('should allow to select fromAll selector', () => {
      const builderInterface: BuilderInterface = {
        selector,
      };
      builder.build(builderInterface);

      expect(builder.exportProjection().indexOf(`${selector}(`)).not.toEqual(
        -1,
      );
    });
  });

  it('should take a category name argument for fromCategory selector', () => {
    const category = 'test';
    const builderInterface: BuilderInterface = {
      selector: { name: 'fromCategory', category },
    };
    builder.build(builderInterface);

    expect(
      builder.exportProjection().indexOf(`${'fromCategory'}(${category})`),
    ).not.toEqual(-1);
  });
});

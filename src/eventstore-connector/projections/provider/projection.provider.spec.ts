import {
  fetchProjections,
  Projection,
  ProvidedProjections,
  provideProjection,
} from './projection.provider';

describe('Projection provider', () => {
  it('should allow to declare projection all over the codebase and then fetch it', () => {
    const projectionA: Projection = {
      name: 'projectionA',
      content: 'blablabla',
    };
    const projectionB: Projection = {
      name: 'projectionB',
      content: 'blablabla',
    };

    provideProjection(projectionA);
    provideProjection(projectionB);
    const projections: ProvidedProjections = fetchProjections();

    expect(projections['projectionA']).toBeTruthy();
    expect(projections['projectionB']).toBeTruthy();
  });
});

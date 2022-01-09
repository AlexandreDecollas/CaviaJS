export interface Projection {
  name: string;
  content: string;
}

export type ProvidedProjections = { [key: string]: Projection };

const providedProjections: ProvidedProjections = {};

export const fetchProjections = (): ProvidedProjections => {
  return providedProjections;
};

export const provideProjection = (projection: Projection): void => {
  providedProjections[projection.name] = projection;
};

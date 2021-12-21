import { BuilderInterface } from './builder.interface';
import { ProjectionOptions } from '../options/projection.options';
import { FromCategorySelector } from '../selectors/from-category.selector';
import { FromAllSelector } from '../selectors/from-all.selector';
import { FromStreamsSelector } from '../selectors/from-streams.selector';
import { FromStreamSelector } from '../selectors/from-stream.selector';
import { WhenFilter } from '../filters/when.filter';
import { ForEachStreamFilter } from '../filters/for-each-stream.filter';
import { OutputStateFilter } from '../filters/output-state.filter';
import { PartitionByFilter } from '../filters/partition-by.filter';
import { FilterByFilter } from '../filters/filter-by.filter';
import { TransformByFilter } from '../filters/transform-by.filter';

export class ProjectionBuilder {
  private builderInterface: BuilderInterface;

  constructor() {
    this.builderInterface = new BuilderInterface();
  }

  public exportProjection(): string {
    return this.builderInterface.toString();
  }

  public addSelector(
    selector:
      | FromAllSelector
      | FromCategorySelector
      | FromStreamSelector
      | FromStreamsSelector,
  ): ProjectionBuilder {
    this.builderInterface.selector = selector;
    return this;
  }

  public addOptions(options: ProjectionOptions): ProjectionBuilder {
    this.builderInterface.options = options;
    return this;
  }

  public addFilter(
    filter:
      | WhenFilter
      | ForEachStreamFilter
      | OutputStateFilter
      | TransformByFilter
      | FilterByFilter
      | PartitionByFilter,
  ): ProjectionBuilder {
    this.builderInterface.filter.push(filter);
    return this;
  }
}

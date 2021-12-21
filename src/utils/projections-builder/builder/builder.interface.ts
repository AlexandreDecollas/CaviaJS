import { ProjectionOptions } from '../options/projection.options';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { format } from 'prettier';
import { FromStreamSelector } from '../selectors/from-stream.selector';
import { FromCategorySelector } from '../selectors/from-category.selector';
import { FromAllSelector } from '../selectors/from-all.selector';
import { FromStreamsSelector } from '../selectors/from-streams.selector';
import { TransformByFilter } from '../filters/transform-by.filter';
import { FilterByFilter } from '../filters/filter-by.filter';
import { WhenFilter } from '../filters/when.filter';
import { ForEachStreamFilter } from '../filters/for-each-stream.filter';
import { OutputStateFilter } from '../filters/output-state.filter';
import { PartitionByFilter } from '../filters/partition-by.filter';

export class BuilderInterface {
  selector?:
    | FromAllSelector
    | FromCategorySelector
    | FromStreamSelector
    | FromStreamsSelector;

  options?: ProjectionOptions;

  filter: Array<
    | WhenFilter
    | ForEachStreamFilter
    | OutputStateFilter
    | TransformByFilter
    | FilterByFilter
    | PartitionByFilter
  > = [];

  public toString(): string {
    const stringBuilder: string[] = [];

    if (!isNil(this.options)) {
      stringBuilder.push(this.options.toString());
    }

    if (!isNil(this.selector)) {
      stringBuilder.push(this.selector.toString());
    }

    if (!isNil(this.filter)) {
      this.filter.forEach(
        (
          filter:
            | WhenFilter
            | ForEachStreamFilter
            | OutputStateFilter
            | TransformByFilter
            | FilterByFilter
            | PartitionByFilter,
        ) => stringBuilder.push(filter.toString()),
      );
    }

    return format(stringBuilder.join(''), { parser: 'typescript' });
  }
}

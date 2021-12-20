import {
  FromAllSelector,
  FromCategorySelector,
  FromStreamSelector,
  FromStreamsSelector,
} from './Selector';
import { ProjectionOptions } from './projection.options';
import { isNil } from '@nestjs/common/utils/shared.utils';
import {
  ForEachStreamFilter,
  OutputStateFilter,
  PartitionByFilter,
  WhenFilter,
} from './projection.filter';

export class BuilderInterface {
  selector?:
    | FromAllSelector
    | FromCategorySelector
    | FromStreamSelector
    | FromStreamsSelector;

  options?: ProjectionOptions;

  filter: Array<
    WhenFilter | ForEachStreamFilter | OutputStateFilter | PartitionByFilter
  > = [];

  public toString(): string {
    const stringBuilder: string[] = [];

    if (!isNil(this.options)) {
      stringBuilder.push(this.options.toString());
    }

    if (!isNil(this.selector)) {
      stringBuilder.push(this.selector.toString());
    }

    if (!isNil(this.selector)) {
      stringBuilder.push(this.filter.toString());
    }

    return stringBuilder.join('');
  }
}

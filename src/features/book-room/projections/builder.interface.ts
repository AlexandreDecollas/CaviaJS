import {
  FromAllSelector,
  FromCategorySelector,
  FromStreamSelector,
  FromStreamsSelector,
} from './Selector';
import { ProjectionOptions } from './projection.options';
import { isNil } from '@nestjs/common/utils/shared.utils';

export class BuilderInterface {
  selector?:
    | FromAllSelector
    | FromCategorySelector
    | FromStreamSelector
    | FromStreamsSelector;

  options?: ProjectionOptions;

  public toString(): string {
    const stringBuilder: string[] = [];

    if (!isNil(this.options)) {
      stringBuilder.push(this.options.toString());
    }

    if (!isNil(this.selector)) {
      stringBuilder.push(this.selector.toString());
    }

    return stringBuilder.join('\n');
  }
}

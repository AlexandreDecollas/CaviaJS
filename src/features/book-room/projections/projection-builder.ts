import {
  FromAllSelector,
  FromCategorySelector,
  FromStreamsSelector,
} from './Selector';
import { BuilderInterface } from './builder.interface';
import { ProjectionOptions } from './projection.options';

export class ProjectionBuilder {
  private builderInterface: BuilderInterface;

  constructor() {
    this.builderInterface = new BuilderInterface();
  }

  public exportProjection(): string {
    return this.builderInterface.toString();
  }

  public addSelector(
    selector: FromAllSelector | FromCategorySelector | FromStreamsSelector,
  ): ProjectionBuilder {
    this.builderInterface.selector = selector;
    return this;
  }

  public addOptions(options: ProjectionOptions): ProjectionBuilder {
    this.builderInterface.options = options;
    return this;
  }
}

import { BuilderInterface } from './builder.interface';

export class ProjectionBuilder {
  private builderInterface: BuilderInterface = {};

  public build(builderInterface: BuilderInterface): void {
    this.builderInterface = builderInterface;
  }

  public exportProjection(): string {
    return `${this.builderInterface.selector}()`;
  }
}

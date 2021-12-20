import { format } from 'prettier';

export interface ProjectionOptionsModel {
  resultStreamName?: string;
  $includeLinks?: boolean;
  processingLag?: number;
  reorderEvents?: boolean;
}

export class ProjectionOptions {
  private options: ProjectionOptionsModel;

  constructor(options: ProjectionOptionsModel) {
    this.options = options;
  }

  public toString(): string {
    return format(
      `options({${
        this.options.resultStreamName
          ? `resultStreamName: '${this.options.resultStreamName}'`
          : ''
      },${
        this.options.$includeLinks
          ? `$includeLinks: ${this.options.$includeLinks}`
          : ''
      },${
        this.options.processingLag
          ? `processingLag: ${this.options.processingLag}`
          : ''
      },${
        this.options.reorderEvents
          ? `reorderEvents: ${this.options.reorderEvents}`
          : ''
      },})`,
      { parser: 'typescript' },
    );
  }
}

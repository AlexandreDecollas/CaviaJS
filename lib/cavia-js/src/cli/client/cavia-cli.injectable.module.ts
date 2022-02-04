import { DynamicModule, Module } from '@nestjs/common';
import { CliModule } from 'cavia-js';

@Module({})
export class CaviaCliModule {
  public static instanciate(appModule: object): DynamicModule {
    return {
      module: CaviaCliModule,
      imports: [appModule as DynamicModule, CliModule],
    };
  }
}

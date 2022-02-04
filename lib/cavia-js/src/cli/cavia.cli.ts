import { NestFactory } from '@nestjs/core';
import { DynamicModule, INestApplication, Module } from '@nestjs/common';
import { CliModule, CliService } from 'cavia-js';

@Module({})
class CaviaCliModule {
  public static instanciate(appModule: object): DynamicModule {
    return {
      module: CaviaCliModule,
      imports: [appModule as DynamicModule, CliModule],
    };
  }
}

export class CaviaCli {
  public static async run(appModule: object, argv: string[]): Promise<void> {
    const app: INestApplication = await NestFactory.create(
      CaviaCliModule.instanciate(appModule),
    );

    await app.init();
    const cliService: CliService = app.get(CliService);

    const argIndex = argv.indexOf('-ce');
    if (argIndex > -1) {
      this.printIfCommandHasEntryPoint(cliService, argv, argIndex);
    } else if (argv.indexOf('-c') > -1) {
      await this.runCommand(cliService, argv);
    } else if (argv.indexOf('-l') > -1) {
      this.printAllCommandsImported(cliService);
    } else {
      this.printError();
    }
    await app.close();
    process.exit(0);
  }

  private static printError(): void {
    console.log('No or unknown option is given, do nothing...');
  }

  private static printIfCommandHasEntryPoint(
    cliService: CliService,
    argv: string[],
    argIndex: number,
  ): void {
    console.log(cliService.hasEntryPointMethod(argv[argIndex + 1]));
  }

  private static async runCommand(
    cliService: CliService,
    argv: string[],
  ): Promise<void> {
    const commandName: string = argv[argv.indexOf('-c') + 1];
    await cliService.runCommand(commandName);
  }

  private static printAllCommandsImported(cliService: CliService): void {
    console.log(cliService.listAllCommands().join(', '));
  }
}

import { NestFactory } from '@nestjs/core';
import { DynamicModule, INestApplication, Module } from '@nestjs/common';
import {
  CLI_BAD_OPTION_MESSAGE,
  CLI_HELP_MESSAGE,
  CliModule,
  CliService,
} from 'cavia-js';

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
    if (argv.indexOf('-h') > -1) {
      this.printHelp();
      return;
    }

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
    console.log(CLI_BAD_OPTION_MESSAGE);
  }

  private static printHelp(): void {
    console.log(CLI_HELP_MESSAGE);
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
    const argumentIndex: number = argv.indexOf('-c');
    const commandName: string = argv[argumentIndex + 1];

    const commandArumentIndex: number = argv.indexOf('-p');
    const commandHasArguments: boolean = commandArumentIndex > -1;
    const commandArguments: any[] = [];
    if (commandHasArguments) {
      let i: number = commandArumentIndex;
      while (argv[i] === '-p') {
        commandArguments.push(JSON.parse(argv[i + 1]) as any);
        i += 2;
      }
    }
    return await cliService.runCommand(commandName, ...commandArguments);
  }

  private static printAllCommandsImported(cliService: CliService): void {
    console.log(cliService.listAllCommands().join(', '));
  }
}

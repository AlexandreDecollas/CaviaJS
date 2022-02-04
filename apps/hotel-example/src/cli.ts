import { CaviaCli } from '../../../lib/cavia-js/src/cli/cavia.cli';
import { AppModule } from './app.module';

CaviaCli.run(AppModule, process.argv);

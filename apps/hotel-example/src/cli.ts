import { CaviaCli } from '../../../lib/cavia-js/src/cli/client/cavia.cli';
import { AppModule } from './app.module';

CaviaCli.run(AppModule, process.argv);

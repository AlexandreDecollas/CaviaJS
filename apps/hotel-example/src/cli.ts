import { CaviaCli } from '../../../lib/cavia-js/src/cli/cavia.cli';
import { AppModule } from './app.module';

console.log('process.argv : ', process.argv);
CaviaCli.run(AppModule, process.argv);

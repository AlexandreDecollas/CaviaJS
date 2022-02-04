import { CaviaCli } from 'cavia-js';
import { AppModule } from './app.module';

CaviaCli.run(AppModule, process.argv);

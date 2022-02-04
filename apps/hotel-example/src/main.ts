import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'debug', 'warn'],
  });
  await app.listen(port);
  console.log(`App is litenning on port ${port}`);
}

bootstrap();

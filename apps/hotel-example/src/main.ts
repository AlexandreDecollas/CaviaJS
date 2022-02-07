import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'debug', 'warn'],
  });

  const config = new DocumentBuilder()
    .setTitle('CaviaJS Demo')
    .setDescription('Event modeling, the hotel example')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {});

  await app.listen(port);
  console.log(`App is listening on port ${port}`);
  console.log(`Swagger on /api`);
}

bootstrap();

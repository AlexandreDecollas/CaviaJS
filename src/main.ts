import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      logger: ['error', 'warn', 'log', 'debug'],
      options: {
        package: 'grpcs',
        protoPath: join(__dirname, '../assets/protos/stuff.proto'),
      },
    },
  );
  await app.listen();
}

bootstrap();

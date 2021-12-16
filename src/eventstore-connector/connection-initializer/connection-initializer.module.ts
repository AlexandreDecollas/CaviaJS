import { Module } from '@nestjs/common';
import { ConnectionInitializerService } from './connection-initializer.service';

@Module({
  providers: [ConnectionInitializerService],
  exports: [ConnectionInitializerService],
})
export class ConnectionInitializerModule {}

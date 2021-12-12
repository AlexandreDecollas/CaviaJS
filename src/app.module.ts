import { Module } from '@nestjs/common';
import { EventEmitterExampleModule } from './example-slice/event-emitter-example.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterExampleModule, EventEmitterModule.forRoot()],
})
export class AppModule {}

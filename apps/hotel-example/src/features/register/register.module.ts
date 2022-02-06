import { Module } from '@nestjs/common';
import { RegisterCommand } from './register.command';

@Module({
  controllers: [RegisterCommand],
})
export class RegisterModule {}

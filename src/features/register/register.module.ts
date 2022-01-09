import { Module } from '@nestjs/common';
import { RegisterService } from './services/register.service';
import { RegisterController } from './controller/register/register.controller';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}

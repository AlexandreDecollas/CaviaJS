import { Module } from '@nestjs/common';
import { RegisterService } from './services/register.service';
import { RegisterController } from './controller/register/register.controller';
import { IdGeneratorService } from '../../utils/id-generator/id-generator.service';

@Module({
  imports: [],
  controllers: [RegisterController],
  providers: [RegisterService, IdGeneratorService],
})
export class RegisterModule {}

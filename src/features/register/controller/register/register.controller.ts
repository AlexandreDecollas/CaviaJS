import { Controller, Get, Param } from '@nestjs/common';
import { RegisterService } from '../../services/register.service';
import { RegisterLine } from '../../model/register-line';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Get('/:clientName/:clientSurname')
  public register(
    @Param('clientName') clientName: string,
    @Param('clientSurname') clientSurname: string,
  ): void {
    const registerLine: RegisterLine = {
      clientName,
      clientSurname,
    };
    this.registerService.registerClient(registerLine);
  }
}

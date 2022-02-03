import { Injectable } from '@nestjs/common';

export const CAVIA = 'CAVIAJS';
export const CAVIA2 = 'CAVIAJS2';

@Injectable()
export class CaviaJsService {
  toto() {
    console.log(CAVIA2);
  }
}

import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class IdGeneratorService {
  public generateId(): string {
    return nanoid();
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public emitEvent(): void {
    this.eventEmitter.emit('order.created', {
      orderId: 1,
      payload: {},
    });
  }
}

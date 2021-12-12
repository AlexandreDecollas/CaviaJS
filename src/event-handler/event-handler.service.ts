import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventHandlerService {
  @OnEvent('order.created', { async: true })
  handleOrderCreatedEvent(payload: any) {
    console.log('payload : ', payload);
  }
}

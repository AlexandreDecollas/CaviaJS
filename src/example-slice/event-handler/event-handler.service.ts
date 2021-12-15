import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Event } from '../../model/event';

@Injectable()
export class EventHandlerService {
  @OnEvent('hotel.registered', { async: true })
  handleOrderCreatedEvent(event: Event) {
    console.log('example slice handler : ', event);
  }
}

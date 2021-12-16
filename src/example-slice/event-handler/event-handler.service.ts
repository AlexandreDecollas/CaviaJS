import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventstoreEvent } from '../../model/eventstoreEvent';

@Injectable()
export class EventHandlerService {
  @OnEvent('hotel.registered', { async: true })
  handleOrderCreatedEvent(event: EventstoreEvent) {
    console.log('example slice handler : ', event);
  }
}

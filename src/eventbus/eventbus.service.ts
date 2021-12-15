import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Event } from '../model/event';

@Injectable()
export class EventbusService {
  @OnEvent('**')
  public hookEvent(event: Event) {
    console.log('hooked event (potentially copy it in eventstore): ', event);
  }
}

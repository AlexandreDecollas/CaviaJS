import { Injectable } from '@nestjs/common';
import { EventsFifo } from './events.fifo';
import { EventstoreEvent } from '../../model/eventstoreEvent';

@Injectable()
export class InMemoryFifoService<E extends EventstoreEvent>
  implements EventsFifo<E>
{
  private queue: E[] = [];

  public add(event: E): void {
    this.queue.push(event);
  }

  public async getFirst(): Promise<E> {
    return this.queue[this.queue.length - 1];
  }

  public pop(): void {
    this.queue.pop();
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

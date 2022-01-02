import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  PARK,
  PersistentSubscription,
  ResolvedEvent,
} from '@eventstore/db-client';
import { PayementRequestedEvent } from '../../../../model/payement-requested.event';
import { PayementSuccededEvent } from '../../../../model/payement-succeded.event';
import { IdGeneratorService } from '../../../../utils/id-generator/id-generator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PersistentSubscriptionService } from '../../../../eventstore-connector/persistent-subscription/upserter/persistent-subscription.service';
import {
  fetchConnectedPersistentSubscriptions,
  ProvidedPersistentSubscriptions,
} from '../../../../eventstore-connector/persistent-subscription/provider/persistent-suscriptions.provider';

@Injectable()
export class PersistentSubscriptionInitializerService implements OnModuleInit {
  constructor(
    private readonly persistentSubscriptionService: PersistentSubscriptionService,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async onModuleInit(): Promise<void> {
    const persistentSubscriptions: ProvidedPersistentSubscriptions =
      fetchConnectedPersistentSubscriptions();
    const paymentProcessorPersub: PersistentSubscription =
      persistentSubscriptions['paymentProcessor'];
    paymentProcessorPersub.on('data', async (payloadEvent: ResolvedEvent) => {
      try {
        this.processToPayment(payloadEvent.event as any);
        await paymentProcessorPersub.ack(payloadEvent);
      } catch (e) {
        await paymentProcessorPersub.nack(PARK, e);
      }
    });
  }
  private processToPayment(event: PayementRequestedEvent): void {
    const payementSuccededEvent: PayementSuccededEvent = {
      metadata: { streamName: 'guest.payement-succedded' },
      data: {
        id: this.idGeneratorService.generateId(),
        clientName: event.data.clientName,
      },
      type: 'PayementSuccededEvent',
    };
    this.eventEmitter.emit(
      payementSuccededEvent.metadata.streamName,
      payementSuccededEvent,
    );
  }
}

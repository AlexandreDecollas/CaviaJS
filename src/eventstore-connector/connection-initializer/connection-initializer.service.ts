import { Injectable } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class ConnectionInitializerService {
  private client: Client;

  public async connectToEventstore(): Promise<Client> {
    console.log('Connecting to evenstore...');
    this.client = EventStoreDBClient.connectionString(
      `esdb://127.0.0.1:2113?tls=false`,
    );
    await this.client.getStreamMetadata('$all');
    console.log('Connected to eventstore');
    return this.client;
  }

  public async getConnectedClient(): Promise<Client> {
    return this.client ?? (await this.connectToEventstore());
  }
}

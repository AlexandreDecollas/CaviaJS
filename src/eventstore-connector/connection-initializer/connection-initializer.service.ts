import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class ConnectionInitializerService implements OnModuleInit {
  private client: Client;

  public async onModuleInit(): Promise<any> {
    console.log('Connecting to evenstore...');
    this.client = EventStoreDBClient.connectionString(
      `esdb://127.0.0.1:2113?tls=false`,
    );
    await this.client.getStreamMetadata('$all');
    console.log('Connected to eventstore');
  }

  public getConnectedClient(): Client {
    return this.client;
  }
}

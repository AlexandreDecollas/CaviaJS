import { Injectable } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class ESDBConnectionService {
  private client: Client;

  public async connectToEventstore(): Promise<Client> {
    const connectionString: string = process.env.CONNECTION_STRING;
    console.log(
      `Connecting to evenstore (connectionString : ${connectionString})...`,
    );
    this.client = EventStoreDBClient.connectionString(connectionString);
    await this.client.getStreamMetadata('$all');
    console.log('Connected to eventstore');
    return this.client;
  }

  public async getConnectedClient(): Promise<Client> {
    return this.client ?? (await this.connectToEventstore());
  }
}

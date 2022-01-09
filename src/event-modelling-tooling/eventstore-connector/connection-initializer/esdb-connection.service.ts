import { Inject, Injectable } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';
import { CONNECTION_STRING } from '../../constants';

@Injectable()
export class ESDBConnectionService {
  private client: Client;

  constructor(
    @Inject(CONNECTION_STRING) private readonly connectionString: string,
  ) {}

  public async connectToEventstore(): Promise<Client> {
    console.log(
      `Connecting to evenstore (connectionString : ${this.connectionString})...`,
    );
    this.client = EventStoreDBClient.connectionString(this.connectionString);
    await this.client.getStreamMetadata('$all');
    console.log('Connected to eventstore');
    return this.client;
  }

  public async getConnectedClient(): Promise<Client> {
    return this.client ?? (await this.connectToEventstore());
  }
}

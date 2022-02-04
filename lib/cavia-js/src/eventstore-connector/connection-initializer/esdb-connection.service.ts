import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';
import { Client } from '@eventstore/db-client/dist/Client';
import { CONNECTION_STRING } from '../../misc/constants';

@Injectable()
export class ESDBConnectionService {
  private client: Client;

  constructor(
    @Inject(CONNECTION_STRING) private readonly connectionString: string,
    private readonly logger: Logger,
  ) {}

  public async connectToEventstore(): Promise<Client> {
    this.logger.log(
      `Connecting to evenstore (connectionString : ${this.connectionString})...`,
    );
    this.client = EventStoreDBClient.connectionString(this.connectionString);
    await this.client.getStreamMetadata('$all');
    this.logger.log('Connected to eventstore');
    return this.client;
  }

  public async getConnectedClient(): Promise<Client> {
    return this.client ?? (await this.connectToEventstore());
  }
}

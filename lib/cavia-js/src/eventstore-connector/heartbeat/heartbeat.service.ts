import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ESDBConnectionService } from '../connection-initializer';
import { Client } from '@eventstore/db-client/dist/Client';
import { HEARTBEAT_INTERVAL } from '../../constants';

@Injectable()
export class HeartbeatService implements OnModuleInit {
  constructor(
    private readonly connection: ESDBConnectionService,
    private readonly logger: Logger,
    @Inject(HEARTBEAT_INTERVAL) private readonly heartbeatInterval: number,
  ) {}

  public async onModuleInit(): Promise<void> {
    if (!Number.isInteger(this.heartbeatInterval)) {
      return;
    }
    await this.startHeartBeat();
  }

  private async startHeartBeat() {
    const client: Client = await this.connection.getConnectedClient();
    setInterval(async () => {
      this.logger.debug(
        `EventStore connection heartbeat checkpoint (every ${
          this.heartbeatInterval / 1000
        } seconds).`,
      );
      const cutter = setTimeout(
        () => this.stopProcess(),
        this.heartbeatInterval,
      );
      await client
        .getStreamMetadata('$all')
        .then(() => clearTimeout(cutter))
        .catch(() => {
          this.stopProcess();
        });
    }, this.heartbeatInterval);
  }

  private stopProcess() {
    this.logger.error(`Timeout reach for eventStore connection.`);
    process.exit(1);
  }
}

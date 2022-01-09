import { ConnectionOptions } from 'bullmq';

export interface RedisQueueConfiguration {
  options: ConnectionOptions;
  queueName: string;
}

export interface EventModellingConfiguration {
  eventstoreConnectionString: string;
  redisQueueConfiguration?: RedisQueueConfiguration;
  checkHeartBeatOnInterval?: number;
}

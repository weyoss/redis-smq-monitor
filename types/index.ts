import { ServerOptions } from 'socket.io';
import { IConfig, TQueueRateLimit } from 'redis-smq/dist/types';

export type TServerConfig = {
  port?: number;
  host?: string;
  socketOpts?: ServerOptions;
  basePath?: string;
};

export type TConfig = IConfig & {
  server?: TServerConfig;
};

export type TWebsocketHeartbeatOnlineIdsStreamPayload = {
  consumers: string[];
};

export type TWebsocketMainStreamPayload = {
  scheduledMessagesCount: number;
  queuesCount: number;
  deadLetteredMessagesCount: number;
  acknowledgedMessagesCount: number;
  pendingMessagesCount: number;
  consumersCount: number;
  queues: {
    [ns: string]: {
      [queueName: string]: TWebsocketMainStreamPayloadQueue;
    };
  };
};

export type TWebsocketMainStreamPayloadQueue = {
  ns: string;
  name: string;
  priorityQueuing: boolean;
  rateLimit: TQueueRateLimit | null;
  deadLetteredMessagesCount: number;
  acknowledgedMessagesCount: number;
  pendingMessagesCount: number;
  consumersCount: number;
};

export type TTimeSeriesRange = ITimeSeriesRangeItem[];

export interface ITimeSeriesRangeItem {
  timestamp: number;
  value: number;
}

export type TMessageRateFields = Record<string, any>;

export interface IConsumerMessageRateFields extends TMessageRateFields {
  acknowledgedRate: number;
  deadLetteredRate: number;
}

export interface IProducerMessageRateFields extends TMessageRateFields {
  publishedRate: number;
  queuePublishedRate: Record<string, number>;
}

export type TTimeSeriesParams = {
  key: string;
  expireAfterInSeconds?: number;
  retentionTimeInSeconds?: number;
  windowSizeInSeconds?: number;
};

export interface IHashTimeSeriesParams extends TTimeSeriesParams {
  indexKey: string;
}

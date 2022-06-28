import 'reflect-metadata';
import { createServer } from 'http';
import * as Koa from 'koa';
import { Server as SocketIO } from 'socket.io';
import * as KoaBodyParser from 'koa-bodyparser';
import { Middleware } from 'redis-smq-monitor-client';
import { v4 as uuid } from 'uuid';
import * as cors from '@koa/cors';
import * as stoppable from 'stoppable';
import { promisifyAll } from 'bluebird';

import { errorHandler } from './middlewares/error-handler';
import { getApplicationRouter } from './common/routing';
import { apiController } from './controllers/api/api-controller';

import { redisKeys } from './common/redis-keys/redis-keys';
import { events } from 'redis-smq';
import { TConfig } from '../types';
import {
  errors,
  PowerManager,
  RedisClient,
  WorkerPool,
  WorkerRunner,
} from 'redis-smq-common';
import { ICompatibleLogger } from 'redis-smq-common/dist/types';
import { createRedisInstance } from './lib/redis';
import { getNamespacedLoggerInstance } from './lib/logger';
import { registry } from './lib/registry';
import {
  destroyQueueManager,
  getQueueManagerInstance,
} from './lib/queue-manager';
import {
  destroyMessageManager,
  getMessageManagerInstance,
} from './lib/message-manager';
import TimeSeriesCleanUpWorker from './workers/time-series.clean-up.worker';
import WebsocketHeartbeatStreamWorker from './workers/websocket-heartbeat-stream.worker';
import WebsocketMainStreamWorker from './workers/websocket-main-stream.worker';
import WebsocketOnlineStreamWorker from './workers/websocket-online-stream.worker';
import WebsocketRateStreamWorker from './workers/websocket-rate-stream.worker';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

// Fixing type-coverage errors and using [unknown] instead of [any]
type TSocketIO = SocketIO<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  unknown
>;

export class MonitorServer {
  protected static instance: MonitorServer | null = null;
  protected config;
  protected powerManager;
  protected logger;
  protected instanceId: string;
  protected workerRunner: WorkerRunner | null = null;
  protected application: {
    app: Koa;
    socketIO: TSocketIO;
    httpServer: ReturnType<typeof stoppable>;
  } | null = null;
  protected redisClient: RedisClient | null = null;
  protected subscribeClient: RedisClient | null = null;

  private constructor(config: TConfig, logger: ICompatibleLogger) {
    this.instanceId = uuid();
    this.config = config;
    this.logger = logger;
    this.powerManager = new PowerManager(false);
    registry.register('config', this.config);
    registry.register('logger', this.logger);
  }

  protected getRequiredProperty<K extends keyof MonitorServer>(
    key: K,
  ): MonitorServer[K] {
    if (!this[key]) {
      throw new errors.PanicError(`Expected a non null value of key [${key}]`);
    }
    return this[key];
  }

  protected getApplication() {
    if (!this.application) {
      throw new errors.PanicError(`Expected a non null value.`);
    }
    return this.application;
  }

  protected getSubscribeClient(): RedisClient {
    if (!this.subscribeClient) {
      throw new errors.PanicError(`Expected a non null value.`);
    }
    return this.subscribeClient;
  }

  protected getRedisClient(): RedisClient {
    if (!this.redisClient) {
      throw new errors.PanicError(`Expected a non null value.`);
    }
    return this.redisClient;
  }

  protected getWorkerRunner(): WorkerRunner {
    if (!this.workerRunner) {
      throw new errors.PanicError(`Expected a non null value.`);
    }
    return this.workerRunner;
  }

  protected async bootstrap() {
    this.redisClient = await createRedisInstance(this.config);
    registry.register('redis', this.redisClient);

    const { socketOpts = {}, basePath } = this.config.server ?? {};
    const app = new Koa();
    app.use(errorHandler);
    app.use(KoaBodyParser());
    app.use(Middleware(['/api/', '/socket.io/'], basePath));
    app.use(
      cors({
        origin: '*',
      }),
    );
    const router = getApplicationRouter(app, [apiController]);
    app.use(router.routes());
    app.use(router.allowedMethods());
    const httpServer = stoppable(createServer(app.callback()));
    const socketIO: TSocketIO = new SocketIO(httpServer, {
      ...socketOpts,
      cors: {
        origin: '*',
      },
    });
    this.application = {
      httpServer,
      socketIO,
      app,
    };
    return this.application;
  }

  protected async subscribe(socketIO: TSocketIO): Promise<void> {
    this.subscribeClient = await createRedisInstance(this.config);
    this.subscribeClient.psubscribe('stream*');
    this.subscribeClient.on(
      'pmessage',
      (pattern: string, channel: string, message: string) => {
        socketIO.emit(channel, JSON.parse(message));
      },
    );
  }

  protected async runWorkers(): Promise<void> {
    const { keyLockMonitorWorkers } = redisKeys.getMainKeys();
    this.workerRunner = new WorkerRunner(
      this.getRedisClient(),
      keyLockMonitorWorkers,
      new WorkerPool(),
      this.logger,
    );
    this.workerRunner.on(events.ERROR, (err: Error) => {
      throw err;
    });
    const redisClient = this.getRedisClient();
    const queueManager = await getQueueManagerInstance(this.config);
    const messageManager = await getMessageManagerInstance(this.config);
    this.workerRunner.addWorker(
      new TimeSeriesCleanUpWorker(redisClient, queueManager, true),
    );
    this.workerRunner.addWorker(
      new WebsocketHeartbeatStreamWorker(redisClient, true),
    );
    this.workerRunner.addWorker(
      new WebsocketMainStreamWorker(
        redisClient,
        messageManager,
        queueManager,
        true,
      ),
    );
    this.workerRunner.addWorker(
      new WebsocketOnlineStreamWorker(redisClient, queueManager, true),
    );
    this.workerRunner.addWorker(
      new WebsocketRateStreamWorker(redisClient, queueManager, true),
    );
    await new Promise((resolve) => {
      this.workerRunner?.once(events.UP, resolve);
      this.workerRunner?.run();
    });
  }

  async listen(): Promise<boolean> {
    const { host = '0.0.0.0', port = 7210 } = this.config.server ?? {};
    const r = this.powerManager.goingUp();
    if (r) {
      this.logger.info('Going up...');
      const { socketIO, httpServer } = await this.bootstrap();
      await this.subscribe(socketIO);
      await this.runWorkers();
      await new Promise<void>((resolve) => {
        httpServer.listen(port, host, resolve);
      });
      this.powerManager.commit();
      this.logger.info(`Instance ID is ${this.instanceId}.`);
      this.logger.info(`Up and running on ${host}:${port}...`);
      return true;
    }
    return false;
  }

  async quit(): Promise<boolean> {
    const r = this.powerManager.goingDown();
    if (r) {
      this.logger.info('Going down...');
      const { httpServer } = this.getApplication();
      await new Promise((resolve) => httpServer.stop(resolve));
      await promisifyAll(this.getWorkerRunner()).quitAsync();
      await promisifyAll(this.getSubscribeClient()).haltAsync();
      await promisifyAll(this.getRedisClient()).haltAsync();
      await destroyMessageManager();
      await destroyQueueManager();
      registry.reset();
      this.workerRunner = null;
      this.application = null;
      this.powerManager.commit();
      this.logger.info('Down.');
      return true;
    }
    return false;
  }

  static createInstance(config: TConfig = {}): MonitorServer {
    if (!MonitorServer.instance) {
      const logger = getNamespacedLoggerInstance(config, 'monitor');
      MonitorServer.instance = new MonitorServer(config, logger);
    }
    return MonitorServer.instance;
  }
}

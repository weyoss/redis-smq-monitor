import { startWebsocketRateStreamWorker } from './websocket-rate-stream-worker';
import { delay } from 'bluebird';
import { startMonitorServer } from './monitor-server';
import * as supertest from 'supertest';
import { TimeSeriesResponseBodyDTO } from '../../src/common/dto/time-series/time-series-response.DTO';
import { getRedisInstance } from './redis-clients';
import { TTimeSeriesRange } from '../../types';

export interface ISuperTestResponse<TData> extends supertest.Response {
  body: {
    data?: TData;
    error?: {
      code: string;
      message: string;
      details: Record<string, any>;
    };
  };
}

export async function listenForWebsocketStreamEvents<
  TPayload = TTimeSeriesRange,
>(
  streamName: string,
  startFn: () => Promise<void> = startWebsocketRateStreamWorker,
) {
  await startFn();
  const subscribeClient = await getRedisInstance();
  subscribeClient.subscribe(streamName);
  const data: { ts: number; payload: TPayload }[] = [];
  subscribeClient.on('message', (channel: string, message: string) => {
    const payload: TPayload = JSON.parse(message);
    data.push({ ts: Date.now(), payload });
  });
  for (; true; ) {
    if (data.length === 10) {
      subscribeClient.unsubscribe(streamName);
      break;
    } else await delay(500);
  }
  return data;
}

export async function validateTimeSeriesFrom(url: string) {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const timestamp = Math.ceil(Date.now() / 1000);
  const from = timestamp - 60;
  const response1: ISuperTestResponse<TimeSeriesResponseBodyDTO['data']> =
    await request.get(`${url}?from=${from}&to=${timestamp}`);
  expect(response1.statusCode).toBe(200);
  const data = response1.body.data ?? [];
  expect(data.length).toEqual(60);
  expect(data[0]).toEqual({
    timestamp: from,
    value: 0,
  });
  expect(data[59]).toEqual({
    timestamp: timestamp - 1,
    value: 0,
  });
}

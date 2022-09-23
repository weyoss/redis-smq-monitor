import * as supertest from 'supertest';
import { startMonitorServer } from '../../../common/monitor-server';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { defaultQueue } from '../../../common/common';

test('Set a queue message consumption rate limit', async () => {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const response1: ISuperTestResponse<void> = await request
    .post(`/api/ns/${defaultQueue.ns}/queues/${defaultQueue.name}/rate-limit`)
    .send({ interval: 10000, limit: 3 });
  expect(response1.statusCode).toBe(204);
  expect(response1.body).toEqual({});
});

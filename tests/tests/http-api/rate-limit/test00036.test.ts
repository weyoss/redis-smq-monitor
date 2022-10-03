import * as supertest from 'supertest';
import { startMonitorServer } from '../../../common/monitor-server';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { defaultQueue } from '../../../common/common';
import { QueueSettingsRateLimitDTO } from '../../../../src/common/dto/queues/queue-settings-rate-limit.DTO';

test('Set a queue message consumption rate limit and retrieve a the queue rate limit', async () => {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const response1: ISuperTestResponse<void> = await request
    .post(`/api/ns/${defaultQueue.ns}/queues/${defaultQueue.name}/rate-limit`)
    .send({ interval: 10000, limit: 3 });
  expect(response1.statusCode).toBe(204);
  expect(response1.body).toEqual({});

  const response2: ISuperTestResponse<QueueSettingsRateLimitDTO> =
    await request.get(
      `/api/ns/${defaultQueue.ns}/queues/${defaultQueue.name}/rate-limit`,
    );
  expect(response2.statusCode).toBe(200);
  expect(response2.body.data).toEqual({ interval: 10000, limit: 3 });

  const response3: ISuperTestResponse<QueueSettingsRateLimitDTO> =
    await request.get(`/api/ns/${defaultQueue.ns}/queues/my-queue/rate-limit`);

  expect(response3.statusCode).toBe(200);
  expect(response3.body.data).toEqual(null);
});

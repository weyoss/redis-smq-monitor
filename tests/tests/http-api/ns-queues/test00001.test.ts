import * as supertest from 'supertest';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { CreateQueueResponseBodyDataDTO } from '../../../../src/controllers/api/queues/create-queue/create-queue.response.DTO';
import { startMonitorServer } from '../../../common/monitor-server';

test('Creating queues', async () => {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const r1: ISuperTestResponse<CreateQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ name: 'ww', ns: 'my-ns', enablePriorityQueuing: false });
  expect(r1.statusCode).toBe(200);
  expect(r1.body.data).toBeDefined();
  expect(r1.body.data).toEqual({
    queue: { name: 'ww', ns: 'my-ns' },
    settings: {
      priorityQueuing: false,
      rateLimit: null,
      exchange: null,
    },
  });

  const r2: ISuperTestResponse<CreateQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ name: 'qq', enablePriorityQueuing: true });
  expect(r2.statusCode).toBe(200);
  expect(r2.body.data).toBeDefined();
  expect(r2.body.data).toEqual({
    queue: { name: 'qq', ns: 'testing' },
    settings: {
      priorityQueuing: true,
      rateLimit: null,
      exchange: null,
    },
  });

  const r3: ISuperTestResponse<CreateQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ name: 'ff' });
  expect(r3.statusCode).toBe(422);
  expect(r3.body.data).toBeUndefined();
  expect(r3.body.error).toBeDefined();

  const r4: ISuperTestResponse<CreateQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ enablePriorityQueuing: true });
  expect(r4.statusCode).toBe(422);
  expect(r4.body.data).toBeUndefined();
  expect(r4.body.error).toBeDefined();
});

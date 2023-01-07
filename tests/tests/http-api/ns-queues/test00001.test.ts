import * as supertest from 'supertest';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { startMonitorServer } from '../../../common/monitor-server';
import { SaveQueueResponseBodyDataDTO } from '../../../../src/controllers/api/queues/save-queue/save-queue.response.DTO';
import { EQueueType } from 'redis-smq/dist/types';

test('Creating queues', async () => {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const r1: ISuperTestResponse<SaveQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ name: 'ww', ns: 'my-ns', type: EQueueType.LIFO_QUEUE });
  expect(r1.statusCode).toBe(200);
  expect(r1.body.data).toBeDefined();
  expect(r1.body.data).toEqual({
    queue: { name: 'ww', ns: 'my-ns' },
    settings: {
      priorityQueuing: false,
      type: EQueueType.LIFO_QUEUE,
      rateLimit: null,
      exchange: null,
    },
  });

  const r2: ISuperTestResponse<SaveQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ name: 'qq', type: EQueueType.PRIORITY_QUEUE });
  expect(r2.statusCode).toBe(200);
  expect(r2.body.data).toBeDefined();
  expect(r2.body.data).toEqual({
    queue: { name: 'qq', ns: 'testing' },
    settings: {
      priorityQueuing: true,
      type: EQueueType.PRIORITY_QUEUE,
      rateLimit: null,
      exchange: null,
    },
  });

  const r3: ISuperTestResponse<SaveQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ name: 'ff' });
  expect(r3.statusCode).toBe(422);
  expect(r3.body.data).toBeUndefined();
  expect(r3.body.error).toBeDefined();

  const r4: ISuperTestResponse<SaveQueueResponseBodyDataDTO> = await request
    .post('/api/queues')
    .send({ type: EQueueType.PRIORITY_QUEUE });
  expect(r4.statusCode).toBe(422);
  expect(r4.body.data).toBeUndefined();
  expect(r4.body.error).toBeDefined();
});

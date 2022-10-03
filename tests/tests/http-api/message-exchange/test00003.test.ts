import { startMonitorServer } from '../../../common/monitor-server';
import * as supertest from 'supertest';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { createQueue } from '../../../common/message-producing';
import { TQueueParams } from 'redis-smq/dist/types';
import { defaultQueue } from '../../../common/common';

test('Bind a queue to an exchange', async () => {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const r1: ISuperTestResponse<string[]> = await request
    .post('/api/exchanges')
    .send({ exchangeName: 'my-exchange' });
  expect(r1.statusCode).toBe(200);
  expect(r1.body.data).toBeDefined();
  expect(r1.body.data).toEqual(['my-exchange']);

  const r2: ISuperTestResponse<TQueueParams[]> = await request.get(
    '/api/exchanges/my-exchange/queues',
  );
  expect(r2.statusCode).toBe(200);
  expect(r2.body.data).toEqual([]);

  await createQueue(defaultQueue, false);
  const r3: ISuperTestResponse<string[]> = await request
    .post('/api/exchanges/my-exchange/bind')
    .send({ queue: defaultQueue });
  expect(r3.statusCode).toBe(204);
  expect(r3.body.data).toBeUndefined();

  const r6: ISuperTestResponse<TQueueParams[]> = await request.get(
    '/api/exchanges/my-exchange/queues',
  );
  expect(r6.statusCode).toBe(200);
  expect(r6.body.data).toEqual([defaultQueue]);

  const r4: ISuperTestResponse<string[]> = await request.delete(
    '/api/exchanges/my-exchange',
  );
  expect(r4.statusCode).toBe(500);
  expect(r4.body.data).toBeUndefined();
  expect(r4.body.error?.message).toEqual(
    'Exchange has 1 bound queue(s). Unbind all queues before deleting the exchange.',
  );

  const r5: ISuperTestResponse<string[]> = await request
    .post('/api/exchanges/my-exchange/unbind')
    .send({ queue: defaultQueue });
  expect(r5.statusCode).toBe(204);
  expect(r5.body.data).toBeUndefined();

  const r7: ISuperTestResponse<TQueueParams[]> = await request.get(
    '/api/exchanges/my-exchange/queues',
  );
  expect(r7.statusCode).toBe(200);
  expect(r7.body.data).toEqual([]);
});

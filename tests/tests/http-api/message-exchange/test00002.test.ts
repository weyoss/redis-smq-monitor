import { startMonitorServer } from '../../../common/monitor-server';
import * as supertest from 'supertest';
import { ISuperTestResponse } from '../../../common/websocket-event';

test('Delete a fanout exchange', async () => {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const r1: ISuperTestResponse<string[]> = await request
    .post('/api/exchanges')
    .send({ exchangeName: 'my-exchange' });
  expect(r1.statusCode).toBe(200);
  expect(r1.body.data).toBeDefined();
  expect(r1.body.data).toEqual(['my-exchange']);

  const r2: ISuperTestResponse<string[]> = await request.get('/api/exchanges');
  expect(r2.statusCode).toBe(200);
  expect(r2.body.data).toEqual(['my-exchange']);

  const r3: ISuperTestResponse<string[]> = await request.delete(
    '/api/exchanges/my-exchange',
  );
  expect(r3.statusCode).toBe(200);
  expect(r3.body.data).toEqual([]);

  const r4: ISuperTestResponse<string[]> = await request.get('/api/exchanges');
  expect(r4.statusCode).toBe(200);
  expect(r4.body.data).toEqual([]);
});

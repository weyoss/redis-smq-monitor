import * as supertest from 'supertest';
import { GetMessagesResponseBodyDataDTO } from '../../../../src/common/dto/queues/get-messages-response-body.DTO';
import { startMonitorServer } from '../../../common/monitor-server';
import { ISuperTestResponse } from '../../../common/websocket-event';

test('Fetching scheduled messages: params validation', async () => {
  await startMonitorServer();
  const request = supertest('http://127.0.0.1:3000');
  const response1: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.get('/api/main/scheduled-messages?skip=a');
  expect(response1.statusCode).toBe(422);
  expect(response1.body.data).toBeUndefined();
  expect(response1.body.error).toBeDefined();
  expect(response1.body.error?.code).toBe(422);
  expect(Object.keys(response1.body.error ?? {})).toEqual(
    expect.arrayContaining(['code', 'message', 'details']),
  );
  expect(Object.keys(response1.body.error?.details ?? {})).toEqual(
    expect.arrayContaining(['target', 'property', 'children', 'constraints']),
  );
});

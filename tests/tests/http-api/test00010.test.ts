import * as supertest from 'supertest';
import { GetMessagesResponseBodyDataDTO } from '../../../src/common/dto/queues/get-messages-response-body.DTO';
import { startMonitorServer } from '../../common/monitor-server';
import {
  createQueue,
  produceMessageWithPriority,
} from '../../common/message-producing';
import { ISuperTestResponse } from '../../common/websocket-event';
import { defaultQueue } from '../../common/common';

test('Fetching pending messages with priority', async () => {
  await startMonitorServer();
  await createQueue(defaultQueue, true);
  const { message, queue } = await produceMessageWithPriority();

  const request = supertest('http://127.0.0.1:3000');
  const response1: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.get(
      `/api/ns/${queue.ns}/queues/${queue.name}/pending-messages?skip=0&take=99`,
    );

  expect(response1.statusCode).toBe(200);
  expect(response1.body.data).toBeDefined();
  expect(response1.body.data?.total).toBe(1);
  expect(response1.body.data?.items.length).toBe(1);
  expect(response1.body.data?.items[0].message.messageState?.uuid).toBe(
    message.getRequiredId(),
  );
});

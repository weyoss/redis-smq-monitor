import * as supertest from 'supertest';
import { Message } from 'redis-smq';
import { GetMessagesResponseBodyDataDTO } from '../../../../src/common/dto/queues/get-messages-response-body.DTO';
import { startMonitorServer } from '../../../common/monitor-server';
import { createQueue } from '../../../common/message-producing';
import { getProducer } from '../../../common/producers';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { defaultQueue } from '../../../common/common';

test('Fetching scheduled messages: pagination', async () => {
  await startMonitorServer();
  await createQueue(defaultQueue, false);

  const producer = getProducer();
  await producer.runAsync();

  const messages: Message[] = [];
  for (let i = 0; i < 4; i += 1) {
    const msg = new Message();
    msg
      .setScheduledDelay(60000 * (i + 1))
      .setBody({ hello: `world ${i}` })
      .setQueue(defaultQueue);
    await producer.produceAsync(msg);
    messages.push(msg);
  }

  const request = supertest('http://127.0.0.1:3000');
  const response1: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.get('/api/main/scheduled-messages?skip=0&take=2');
  expect(response1.statusCode).toBe(200);
  expect(response1.body.data).toBeDefined();
  expect(response1.body.data?.total).toBe(4);
  expect(response1.body.data?.items.length).toBe(2);
  expect(response1.body.data?.items[0].message.messageState?.uuid).toBe(
    messages[0].getRequiredId(),
  );
  expect(response1.body.data?.items[1].message.messageState?.uuid).toBe(
    messages[1].getRequiredId(),
  );

  const response2: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.get('/api/main/scheduled-messages?skip=2&take=2');
  expect(response2.statusCode).toBe(200);
  expect(response2.body.data).toBeDefined();
  expect(response2.body.data?.total).toBe(4);
  expect(response2.body.data?.items.length).toBe(2);
  expect(response2.body.data?.items[0].message.messageState?.uuid).toBe(
    messages[2].getRequiredId(),
  );
  expect(response2.body.data?.items[1].message.messageState?.uuid).toBe(
    messages[3].getRequiredId(),
  );

  const response3: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.get('/api/main/scheduled-messages?skip=4&take=2');
  expect(response3.statusCode).toBe(200);
  expect(response3.body.data).toBeDefined();
  expect(response3.body.data?.total).toBe(4);
  expect(response3.body.data?.items.length).toBe(0);
});

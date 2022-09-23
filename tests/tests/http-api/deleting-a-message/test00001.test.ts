import * as supertest from 'supertest';
import { GetMessagesResponseBodyDataDTO } from '../../../../src/common/dto/queues/get-messages-response-body.DTO';
import { createQueue } from '../../../common/message-producing';
import { startMonitorServer } from '../../../common/monitor-server';
import { Message } from 'redis-smq';
import { getProducer } from '../../../common/producers';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { defaultQueue } from '../../../common/common';

test('Deleting a scheduled message', async () => {
  await createQueue(defaultQueue, false);

  await startMonitorServer();
  const producer = getProducer();
  await producer.runAsync();

  const msg1 = new Message();
  msg1
    .setScheduledCRON('0 * * * * *')
    .setBody({ hello: 'world1' })
    .setQueue(defaultQueue);
  await producer.produceAsync(msg1);

  const request = supertest('http://127.0.0.1:3000');

  //
  const response1: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.get('/api/main/scheduled-messages?skip=0&take=100');
  expect(response1.statusCode).toBe(200);
  expect(response1.body.data).toBeDefined();
  expect(response1.body.data?.total).toBe(1);
  expect(response1.body.data?.items.length).toBe(1);
  expect(response1.body.data?.items[0].message.messageState?.uuid).toBe(
    msg1.getRequiredId(),
  );

  //
  const response2: ISuperTestResponse<void> = await request.delete(
    `/api/main/scheduled-messages/${msg1.getRequiredId()}?sequenceId=${
      response1.body.data?.items[0].sequenceId
    }`,
  );
  expect(response2.statusCode).toBe(204);
  expect(response2.body).toEqual({});

  //
  const response3: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.get('/api/main/scheduled-messages?skip=0&take=100');
  expect(response3.statusCode).toBe(200);
  expect(response3.body.data).toBeDefined();
  expect(response3.body.data?.total).toBe(0);
  expect(response3.body.data?.items.length).toBe(0);
});

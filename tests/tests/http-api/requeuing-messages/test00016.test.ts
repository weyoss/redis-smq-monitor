import * as supertest from 'supertest';
import { GetMessagesResponseBodyDataDTO } from '../../../../src/common/dto/queues/get-messages-response-body.DTO';
import { startMonitorServer } from '../../../common/monitor-server';
import {
  createQueue,
  produceAndDeadLetterMessage,
} from '../../../common/message-producing';
import { ISuperTestResponse } from '../../../common/websocket-event';
import { defaultQueue } from '../../../common/common';

test('Requeuing a dead-lettered messages', async () => {
  await startMonitorServer();
  await createQueue(defaultQueue, false);
  const { message, queue } = await produceAndDeadLetterMessage();
  const request = supertest('http://127.0.0.1:3000');
  const response1: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.post(
      `/api/ns/${queue.ns}/queues/${
        queue.name
      }/dead-lettered-messages/${message.getRequiredId()}/requeue?sequenceId=0`,
    );
  expect(response1.statusCode).toBe(204);
  expect(response1.body).toEqual({});
});

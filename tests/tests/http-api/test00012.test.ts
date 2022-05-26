import * as supertest from 'supertest';
import { GetMessagesResponseBodyDataDTO } from '../../../src/common/dto/queues/get-messages-response-body.DTO';
import { startMonitorServer } from '../../common/monitor-server';
import {
  createQueue,
  produceAndAcknowledgeMessage,
} from '../../common/message-producing';
import { ISuperTestResponse } from '../../common/websocket-event';
import { defaultQueue } from '../../common/common';

test('Delete an acknowledged message', async () => {
  await startMonitorServer();
  await createQueue(defaultQueue, false);
  const { message, queue } = await produceAndAcknowledgeMessage();
  const request = supertest('http://127.0.0.1:3000');
  const response1: ISuperTestResponse<GetMessagesResponseBodyDataDTO> =
    await request.delete(
      `/api/ns/${queue.ns}/queues/${
        queue.name
      }/acknowledged-messages/${message.getRequiredId()}?sequenceId=0`,
    );
  expect(response1.statusCode).toBe(204);
  expect(response1.body).toEqual({});
});

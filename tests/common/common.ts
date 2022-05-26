import { TQueueParams } from 'redis-smq/dist/types';
import { config } from './config';

export const defaultQueue: TQueueParams = {
  name: 'test_queue',
  ns: config.namespace ?? 'testing',
};

export function validateTime(
  actualTime: number,
  expectedTime: number,
  driftTolerance = 3000,
): boolean {
  return (
    actualTime >= expectedTime - driftTolerance &&
    actualTime <= expectedTime + driftTolerance
  );
}

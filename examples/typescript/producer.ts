import { Message, Producer } from 'redis-smq';
import { config } from './config';
import { init, queue } from './init';

const producer = new Producer(config);

const produce = (err?: Error | null) => {
  if (err) throw err;
  setTimeout(() => {
    const m = new Message().setBody(Date.now()).setQueue(queue);
    producer.produce(m, produce);
  }, 500);
};

init((err) => {
  if (err) throw err;
  produce();
});

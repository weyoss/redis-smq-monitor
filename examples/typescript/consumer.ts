import { Consumer } from 'redis-smq';
import { config } from './config';
import { init, queue } from './init';

const consumer = new Consumer(config);
consumer.consume(
  queue,
  (msg, cb) => cb(),
  (err) => {
    if (err) throw err;
  },
);

init((err) => {
  if (err) throw err;
  consumer.run();
});

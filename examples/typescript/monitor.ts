import { MonitorServer } from '../..'; // from 'redis-smq-monitor'

const monitorServer = MonitorServer.createInstance();
monitorServer.listen().catch((err: Error) => {
  console.error(err);
});

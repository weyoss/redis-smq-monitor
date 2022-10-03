import { MonitorServer } from '../..';
import { config } from './config';

let monitorServer: MonitorServer | null = null;

export async function startMonitorServer(): Promise<void> {
  if (!monitorServer) {
    monitorServer = MonitorServer.createInstance(config);
    await monitorServer.listen();
  }
}

export async function stopMonitorServer(): Promise<void> {
  if (monitorServer) {
    await monitorServer.quit();
    monitorServer = null;
  }
}

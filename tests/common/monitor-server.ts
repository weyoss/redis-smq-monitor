import { MonitorServer } from '../..';
import { monitorConfig } from './config';

let monitorServer: MonitorServer | null = null;

export async function startMonitorServer(): Promise<void> {
  if (!monitorServer) {
    monitorServer = MonitorServer.createInstance(monitorConfig);
    await monitorServer.listen();
  }
}

export async function stopMonitorServer(): Promise<void> {
  if (monitorServer) {
    await monitorServer.quit();
    monitorServer = null;
  }
}

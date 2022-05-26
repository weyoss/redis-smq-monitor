import { IRouteController } from '../../../common/routing';
import { controller as consumerTimeSeriesController } from './consumer/time-series/controller';

export const consumersController: IRouteController = {
  path: '/consumers',
  actions: [consumerTimeSeriesController],
};

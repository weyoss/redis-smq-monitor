import { IRouteController } from '../../common/routing';
import { mainController } from './main/main.controller';
import { queuesController } from './queues/queues.controller';
import { namespacesController } from './namespaces/namespaces.controller';
import { consumersController } from './consumers/consumers.controller';
import { exchangesController } from './exchanges/exchanges.controller';

export const apiController: IRouteController = {
  path: '/api',
  actions: [
    mainController,
    namespacesController,
    queuesController,
    consumersController,
    exchangesController,
  ],
};

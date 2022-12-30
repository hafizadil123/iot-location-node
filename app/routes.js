import { Router } from 'express';
import UsersController from './controllers/user.controller';
import IotController from './controllers/IotController';

import errorHandler from './middleware/error-handler';

const routes = new Router();

// Users
routes.post('/api/users/register', UsersController.register);
routes.post('/api/users/register', UsersController.login);
routes.get('/api/get-stats', IotController.getStats)
routes.get('/api/get-cities', IotController.getCities)
routes.get('/api/get-states', IotController.getStates)
routes.get('/api/get-branches', IotController.getBranchs)
routes.get('/api/get-branchInfo', IotController.getBranchInfo)

routes.use(errorHandler);

export default routes;

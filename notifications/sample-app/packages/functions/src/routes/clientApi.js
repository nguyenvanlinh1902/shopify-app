import Router from 'koa-router';
import {getClientData,getSetting} from '../controllers/clientApiController';

export default function clientApiRouter(prefix='/clientApi') {
  const router = new Router({prefix});
  router.get('/getNotificationsShop', getClientData);
  router.get('/getSetting', getSetting);

  return router;
}

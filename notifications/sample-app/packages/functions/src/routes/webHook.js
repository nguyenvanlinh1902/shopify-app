import Router from 'koa-router';
import {createNotification} from '@functions/controllers/webhookOrderController';

export default function webhookRouter(prefix = '/webhookApi') {
  const router = new Router({prefix});
  router.post('/newOrder', createNotification);

  return router;
}

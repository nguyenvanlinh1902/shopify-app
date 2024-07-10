import Router from 'koa-router';
import {getSettingsMedia, handleAuth} from '@functions/controllers/informationController';

export default function clientApiRouter(prefix = '/clientApi') {
  const router = new Router({prefix});
  router.get('/getToken', handleAuth);
  router.get('/getMedia', getSettingsMedia);

  return router;
}

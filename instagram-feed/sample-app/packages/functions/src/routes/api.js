import Router from 'koa-router';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import * as informationController from '@functions/controllers/informationController';
import * as mediaController from '@functions/controllers/mediaController';
import jsonType from '@functions/middleware/jsonType';
import * as settingsController from '@functions/controllers/settingController';

export default function getRoutes(prefix = '/api') {
  const router = new Router({
    prefix
  });

  router.get('/shops', shopController.getUserShops);
  router.get('/shop/get/:domain', shopController.getOne);
  router.put('/shop/set', jsonType, shopController.setOne);
  router.get('/shop/embedStatus', shopController.getEmbedStatus);
  router.put('/republish', shopController.republishTheme);
  router.get('/subscription', subscriptionController.getSubscription);

  router.post('/logout', informationController.handleLogout);
  router.get('/settings', settingsController.getSettingsController);
  router.put('/settings', settingsController.updateSettingsController);
  router.get('/sync-media', mediaController.handleGetNewMedia);
  router.put('/updateMedia', mediaController.handleUpdateMedia);
  return router;
}

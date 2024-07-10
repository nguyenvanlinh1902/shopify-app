import Shopify from 'shopify-api-node';
import {getCurrentShop} from '../helpers/auth';
import {getNotificationsByShopId} from '../repositories/notificationRepository';
import {getCurrentUserShopId} from '@avada/core/build/authentication';
import {getShopById} from '@avada/core';

export async function getNotifications(ctx) {
  const shopId = getCurrentShop(ctx);
  const {notifications, pageInfo} = await getNotificationsByShopId(shopId);
  ctx.body = {data: notifications, success: true, pageInfo};
  console.log(notifications);
}

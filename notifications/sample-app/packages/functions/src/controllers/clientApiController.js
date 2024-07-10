import {getNotificationsByShopId} from '../repositories/notificationRepository';
import {getShopByShopifyDomain} from '@avada/core';
import {getSettingsByShopId} from '@functions/repositories/settingsRepository';

export async function getClientData(ctx) {
  const {domain} = ctx.query;
  const shopData = await getShopByShopifyDomain(domain);
  const {notifications} = await getNotificationsByShopId(shopData.id);
  return (ctx.body = {data: {notifications}, success: true});

}
export async function getSetting(ctx) {
  const {domain} = ctx.query;
  const shopData = await getShopByShopifyDomain(domain);
  const setting = await getSettingsByShopId(shopData.id);
  return (ctx.body = {data: setting, success: true});

}

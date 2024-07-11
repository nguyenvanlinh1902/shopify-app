import {getSettings, setSettings} from '../repositories/settingRepository';
import {syncMedia, getMedia} from '../repositories/mediaRepository';
import chunkArray from '../helpers/utils/chunkArray';
import {getCurrentShop} from '../helpers/auth';
import Instagram from '../helpers/instagram';
import {getShopByShopifyDomain} from '@avada/core';

const instagram = new Instagram();

export async function handleAuth(ctx) {
  const {code, state: shopId} = ctx.query;
  const resp = await instagram.getTokenByCode(code);
  const longLivedTokens = await instagram.getLongLivedTokens(resp.access_token);

  const [user, media] = await Promise.all([
    instagram.getUserByAccessToken(longLivedTokens),
    instagram.getMediaByAccessToken(longLivedTokens)
  ]);

  await Promise.all([setSettings(shopId, user), syncMedia(chunkArray(media.data, 5), shopId)]);

  ctx.body = {success: true, data: longLivedTokens};
}
export async function handleLogout(ctx) {
  const shopId = getCurrentShop(ctx);
  await setSettings(shopId, {
    accessToken: '',
    accessTokenExpiry: '',
    username: ''
  });
  await deleteMedia(shopId);
  ctx.body = {success: true};
}

export async function getSettingsMedia(ctx) {
  const {domain} = ctx.query;
  const shopData = await getShopByShopifyDomain(domain);

  // eslint-disable-next-line no-unused-vars
  const [settings, media] = await Promise.all([getSettings(shopData.id), getMedia(shopData.id)]);
  const data = {
    settings: settings,
    media: media
  };
  ctx.body = {success: true, data: data};
}

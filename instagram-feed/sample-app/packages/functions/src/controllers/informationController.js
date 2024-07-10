import {getSettings, setSettings, syncSettings} from '../repositories/settingRepository';
import {syncMedia, deleteMedia, getMedia} from '../repositories/mediaRepository';
import chunkArray from '../helpers/utils/chunkArray';
import {getCurrentShop} from '../helpers/auth';
import Instagram from '../helpers/instagram';
import separateMedia from '../helpers/utils/separateMedia';
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

  const imageExpiry = new Date();
  imageExpiry.setDate(imageExpiry.getDate() + 3);

  const videoExpiry = new Date();
  videoExpiry.setDate(videoExpiry.getDate() + 1.5);

  const {images, videos} = separateMedia(media.data);

  await Promise.all([
    syncSettings({...user, shopId},shopId),
    syncMedia(chunkArray(images, 5), shopId, 'IMAGE', imageExpiry),
    syncMedia(chunkArray(videos, 5), shopId, 'VIDEO', videoExpiry)
  ]);

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
  console.log(shopData.id);

  // eslint-disable-next-line no-unused-vars
  const [settings, media] = await Promise.all([getSettings(shopData.id), getMedia(shopData.id)]);
  console.log('settings');
  console.log(settings);
  const data = {
    settings: settings,
    media: media
  };
  ctx.body = {success: true, data: data};
}

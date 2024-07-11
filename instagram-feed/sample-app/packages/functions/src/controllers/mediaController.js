import Instagram from '../helpers/instagram';
import {syncMedia, getMedia} from '../repositories/mediaRepository';
import chunkArray from '../helpers/utils/chunkArray';
import {getCurrentShop} from '../helpers/auth';
import {getSettings} from '@functions/repositories/settingRepository';

const instagram = new Instagram();

export async function handleGetNewMedia(ctx) {
  const shopId = getCurrentShop(ctx);
  const settings = await getSettings(shopId);
  const longLivedTokens = settings.accessToken; // Assuming settings have accessToken

  const media = await instagram.getMediaByAccessToken(longLivedTokens);

  await syncMedia(chunkArray(media.data, 5), shopId);
  const allMedia = await getMedia(shopId);
  ctx.body = {success: false, data: allMedia};
}

export async function handleUpdateMedia(ctx) {
  const shopId = getCurrentShop(ctx);
  const settings = await getSettings(shopId);

  const longLivedTokens = settings.accessToken;

  const media = await instagram.getMediaByAccessToken(longLivedTokens);
  await syncMedia(chunkArray(media.data, 5), shopId);
  const allMedia = await getMedia(shopId);
  ctx.body = {success: false, data: allMedia};
}

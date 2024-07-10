import Instagram from '../helpers/instagram';
import {syncMedia, deleteMedia, getMedia} from '../repositories/mediaRepository';
import chunkArray from '../helpers/utils/chunkArray';
import {getCurrentShop} from '../helpers/auth';
import {getSettings} from '@functions/repositories/settingRepository';
import separateMedia from '@functions/helpers/utils/separateMedia';

const instagram = new Instagram();

export async function handleGetNewMedia(ctx) {
  const shopId = getCurrentShop(ctx);
  const settings = await getSettings(shopId);
  await deleteMedia(shopId);
  const longLivedTokens = settings.accessToken; // Assuming settings have accessToken

  const media = await instagram.getMediaByAccessToken(longLivedTokens);
  const imageExpiry = new Date();
  imageExpiry.setDate(imageExpiry.getDate() + 3);

  const videoExpiry = new Date();
  videoExpiry.setDate(videoExpiry.getDate() + 1.5);
  const {images, videos} = separateMedia(media.data);
  await syncMedia(chunkArray(images, 5), shopId, 'IMAGE', imageExpiry);
  await syncMedia(chunkArray(videos, 5), shopId, 'VIDEO', videoExpiry);
  const allMedia = await getMedia(shopId);
  ctx.body = {success: false, data: allMedia};
}

export async function handleUpdateMedia(ctx) {
  const shopId = getCurrentShop(ctx);
  const settings = await getSettings(shopId);

  const longLivedTokens = settings.accessToken;

  const media = await instagram.getMediaByAccessToken(longLivedTokens);

  const imageExpiry = new Date();
  imageExpiry.setDate(imageExpiry.getDate() + 3);
  const videoExpiry = new Date();
  videoExpiry.setDate(videoExpiry.getDate() + 1.5);
  const {images, videos} = separateMedia(media.data);
  await syncMedia(chunkArray(images, 5), shopId, 'IMAGE', imageExpiry);
  await syncMedia(chunkArray(videos, 5), shopId, 'VIDEO', videoExpiry);
  const allMedia = await getMedia(shopId);
  ctx.body = {success: false, data: allMedia};
}

import Instagram from '../helpers/instagram';
import {
  batchUpdateFirestore,
  getDataMedia,
  getMedia,
  setMedia,
  syncMedia
} from '../repositories/mediaRepository';
import {getCurrentShop} from '../helpers/auth';
import {getSettings} from '@functions/repositories/settingRepository';
import chunkArray from '@functions/helpers/utils/chunkArray';

const instagram = new Instagram();

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function handleGetNewMedia(ctx) {
  const shopId = getCurrentShop(ctx);
  const settings = await getSettings(shopId);
  const longLivedTokens = settings.accessToken; // Assuming settings have accessToken

  const media = await instagram.getMediaByAccessToken(longLivedTokens);

  const allMedia = await syncMedia(media.data, shopId);
  ctx.body = {success: false, data: allMedia};
}
/**
 *
 * @param shopId
 * @param accessToken
 * @returns {Promise<Array>}
 */
export async function getInfoMedia(shopId, accessToken) {
  const mediaData = await getDataMedia(shopId);
  const allMedia = mediaData.flatMap(item => item.data.media);
  const mediaWithUrlStatus = allMedia.map(mediaItem => ({
    ...mediaItem,
    isUrlValid: isIgMediaUrlValidTill(mediaItem.media_url)
  }));
  if (mediaWithUrlStatus.some(media => !media.isUrlValid)) {
    const newMedia = await instagram.getMediaByAccessToken(accessToken);
    return prepareUpdates(mediaData, newMedia, shopId);
  }
  return allMedia;
}

/**
 * Check if Instagram media URL is valid till a given date
 * @param {string} mediaUrl
 * @param {Date} till
 * @return {boolean}
 */
function isIgMediaUrlValidTill(mediaUrl, till = new Date()) {
  if (!mediaUrl) {
    return false;
  }
  const url = new URL(mediaUrl);
  const urlExpiryTimestamp = parseInt(url.searchParams.get('oe') ?? '0', 16);
  const tillTimestamp = Math.floor(till.getTime() / 1000);
  return tillTimestamp <= urlExpiryTimestamp;
}

/**
 * Chuẩn bị dữ liệu cập nhật hoặc thêm mới media vào Firestore.
 *
 * @param {Array} existingDocs - Mảng các tài liệu media hiện có
 * @param {Array} media - Mảng các đối tượng media cần đồng bộ hóa hoặc thêm mới
 * @param shopId
 * @param type
 * @returns {Map} - Map chứa các cập nhật hoặc tạo mới tài liệu trong Firestore
 */
export async function prepareUpdates(existingDocs, media, shopId, type = 'update') {
  const updates = new Map();
  const newMedia = [];
  const allExistingMediaIds = new Set(
      existingDocs.flatMap(doc => doc.data.media.map(item => item.id))
  );

  // Tạo một map từ media mới với id làm key
  const mediaMap = new Map(media.map(item => [item.id, item]));

  existingDocs.forEach(({id: docId, data}) => {
    const updatedMedia = data.media.map(item => {
      if (mediaMap.has(item.id)) {
        return {...item, ...mediaMap.get(item.id)};
      }
      return item;
    });

    // Thêm các media item mới nếu chưa tồn tại và số lượng dưới 5
    if (updatedMedia.length < 5 && type !== 'update') {
      media.forEach(mediaItem => {
        if (updatedMedia.length < 5 && !allExistingMediaIds.has(mediaItem.id)) {
          updatedMedia.push(mediaItem);
          allExistingMediaIds.add(mediaItem.id);
        }
      });
    }
    const updatedDoc = {
      ...data,
      media: updatedMedia
    };
    updates.set(docId, updatedDoc);
  });
  await batchUpdateFirestore(updates);
  if (type !== 'update') {
    media.forEach(mediaItem => {
      if (!allExistingMediaIds.has(mediaItem.id)) {
        newMedia.push(mediaItem);
      }
    });
    await setMedia(chunkArray(newMedia, 5), shopId);
  }

  return [...Array.from(updates.values()).flatMap(doc => doc.media), ...newMedia];
}

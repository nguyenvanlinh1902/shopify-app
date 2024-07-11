import {Firestore} from '@google-cloud/firestore';
import Instagram from '../helpers/instagram';
import chunkArray from '@functions/helpers/utils/chunkArray';

const firestore = new Firestore();
const mediaRef = firestore.collection('media');
const instagram = new Instagram();

/**
 * Get and update all media for a shop
 * @param {string} shopId
 * @return {Promise<Array>}
 */
export async function getMedia(shopId) {
  try {
    // Lấy thông tin media từ Firestore
    const snapshot = await mediaRef.where('shopId', '==', shopId).get();
    const media = [];
    for (const doc of snapshot.docs) {
      const docData = doc.data();
      if (Array.isArray(docData.media)) {
        for (const mediaItem of docData.media) {
          if (mediaItem.media_url && !isIgMediaUrlValidTill(mediaItem.media_url)) {
            // Nếu media_url hết hạn, lấy lại thông tin từ Instagram API
            try {
              const updatedMedia = await instagram.getMediaByAccessToken(docData.accessToken);
              await syncMedia(chunkArray(updatedMedia.data, 5), shopId); // Sử dụng await để đảm bảo việc đồng bộ hóa hoàn tất trước khi tiếp tục
            } catch (error) {
              console.error(`Failed to update media for shop ${shopId}:`, error);
            }
          } else {
            media.push({...mediaItem, shopId});
          }
        }
      }
    }

    return media;
  } catch (error) {
    console.error('Error getting media:', error);
    return [];
  }
}

/**
 * Đồng bộ media vào Firestore.
 * Cập nhật các media hiện có hoặc thêm mới các media vào các tài liệu.
 * @param {Array<Array>} mediaChunks - Các chunk của media với kích thước tối đa 5.
 * @param {string} shopId - ID của shop.
 * @returns {Promise<boolean>} - Trả về true nếu thành công, false nếu thất bại.
 */
export async function syncMedia(mediaChunks, shopId) {
  try {
    const existingDocsSnapshot = await mediaRef.where('shopId', '==', shopId).get();
    const existingDocs = existingDocsSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    const allExistingMediaIds = new Set();
    // get List id media đã tồn tại
    for (const doc of existingDocs) {
      doc.data.media.forEach(item => allExistingMediaIds.add(item.id));
    }
    const updates = new Map(); // Lưu trữ các bản ghi cần cập nhật hoặc tạo mới.

    for (const chunk of mediaChunks) {
      let chunkAdded = false;

      for (const {id: docId, data} of existingDocs) {
        const updatedMedia = [...data.media];
        let updated = false; // Flag để đánh dấu nếu có sự thay đổi trong media

        for (const mediaItem of chunk) {
          const existingMediaIndex = updatedMedia.findIndex(item => item.id === mediaItem.id);
          if (existingMediaIndex >= 0) {
            const existingMedia = updatedMedia[existingMediaIndex];

            if (hasMediaChanged(existingMedia, mediaItem)) {
              updatedMedia[existingMediaIndex] = {
                ...existingMedia,
                ...mediaItem
              };
              updated = true;
            }
          } else if (updatedMedia.length < 5 && !allExistingMediaIds.has(mediaItem.id)) {
            // Thêm media mới vào tài liệu hiện tại nếu chưa đủ 5 bản ghi và mediaItem chưa tồn tại
            updatedMedia.push({...mediaItem});
            allExistingMediaIds.add(mediaItem.id);
            updated = true;
          }
        }

        if (updated) {
          updates.set(docId, {shopId, media: updatedMedia});
          chunkAdded = true;
          break;
        }
      }

      if (!chunkAdded) {
        // Nếu không tìm thấy tài liệu nào có ít hơn 5 media, tạo mới tài liệu.
        const newDocRef = mediaRef.doc();
        const filteredChunk = chunk.filter(item => !allExistingMediaIds.has(item.id));
        updates.set(newDocRef.id, {shopId, media: filteredChunk});
        filteredChunk.forEach(item => allExistingMediaIds.add(item.id));
      }
    }

    // Cập nhật hoặc tạo mới các tài liệu trong Firestore.
    const batch = firestore.batch();
    updates.forEach((data, docId) => {
      const docRef = mediaRef.doc(docId);
      batch.set(docRef, data, {merge: true});
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error syncing media:', error);
    return false;
  }
}
/**
 * Get the count of unique media IDs for a given shopId
 *
 * @param {string} shopId - The ID of the shop
 * @returns {Promise<number>} - The count of unique media IDs
 */
export async function getUniqueMediaCount(shopId) {
  try {
    // Lấy snapshot của các tài liệu với điều kiện shopId
    const existingDocsSnapshot = await mediaRef.where('shopId', '==', shopId).get();

    // Lấy tất cả dữ liệu tài liệu và thu thập các ID media vào một Set để đảm bảo tính duy nhất
    const allExistingMediaIds = new Set();
    existingDocsSnapshot.docs.forEach(doc => {
      doc.data().media.forEach(item => allExistingMediaIds.add(item.id));
    });

    // Trả về số lượng ID media duy nhất
    return allExistingMediaIds.size;
  } catch (error) {
    console.error('Error getting unique media count:', error);
    throw new Error('Failed to get unique media count');
  }
}
/**
 * Check if Instagram media URL is valid till a given date
 * @param {string} mediaUrl
 * @param {Date} till
 * @return {boolean}
 */
function isIgMediaUrlValidTill(mediaUrl, till = new Date()) {
  const url = new URL(mediaUrl);
  const urlExpiryTimestamp = parseInt(url.searchParams.get('oe') ?? '0', 16);
  const tillTimestamp = Math.floor(till.getTime() / 1000);
  return tillTimestamp <= urlExpiryTimestamp;
}

/**
 * Check if there are any changes between two media objects.
 * @param {Object} existingMedia - The existing media object.
 * @param {Object} newMedia - The new media object to compare.
 * @return {boolean} - Returns true if there are changes, false otherwise.
 */
function hasMediaChanged(existingMedia, newMedia) {
  return (
    existingMedia.media_type !== newMedia.media_type ||
    existingMedia.media_url !== newMedia.media_url ||
    existingMedia.timestamp !== newMedia.timestamp ||
    Object.keys(existingMedia).some(key => existingMedia[key] !== newMedia[key])
  );
}

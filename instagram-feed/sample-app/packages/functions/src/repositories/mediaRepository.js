import {Firestore} from '@google-cloud/firestore';
import {prepareUpdates} from '@functions/controllers/mediaController';
import chunkArray from '@functions/helpers/utils/chunkArray';
const firestore = new Firestore();
const mediaRef = firestore.collection('media');
const batch = firestore.batch();
/**
 * Lấy tất cả các đối tượng media từ Firestore cho một shop cụ thể.
 *
 * @param {string} shopId - ID của cửa hàng để liên kết với các media
 * @returns {Promise<Array>} - Promise chứa mảng các đối tượng media
 */
export async function getMedia(shopId) {
  try {
    const querySnapshot = await mediaRef.where('shopId', '==', shopId).get();
    return querySnapshot.docs.flatMap(doc => doc.data().media);
  } catch (error) {
    console.log(error);
    return [];
  }
}
/**
 * Lấy tất cả các đối tượng media từ Firestore cho một shop cụ thể.
 *
 * @param {string} shopId - ID của cửa hàng để liên kết với các media
 * @returns {Promise<Array>} - Promise chứa mảng các đối tượng media
 */
export async function getDataMedia(shopId) {
  try {
    const querySnapshot = await mediaRef.where('shopId', '==', shopId).get();
    return querySnapshot.docs.map(doc => ({id: doc.id, data: doc.data()}));
  } catch (error) {
    console.log(error);
    return [];
  }
}
/**
 * Set media items into Firestore for a shop
 * @param {string} shopId - The ID of the shop to associate the media with
 * @param {Array} media - Array of media objects to set or update
 * @return {Promise<void>}
 */
export async function setMedia(media, shopId) {
  try {
    media.map(async item => {
      const docRef = mediaRef.doc();
      await docRef.set({
        media: item.map(item => ({...item, updatedAt: Date.now()})),
        shopId
      });
    });

    await batch.commit();
    return media;
  } catch (error) {
    console.log(error);
    return {error: 'something went wrong!'};
  }
}
/**
 * Đồng bộ media vào Firestore.
 * Cập nhật các media hiện có hoặc thêm mới các media vào các tài liệu.
 *
 * @param {Array} media - Mảng các đối tượng media cần đồng bộ hóa hoặc thêm mới
 * @param {string} shopId - ID của cửa hàng để liên kết với các media
 * @returns {Promise<boolean>} - Trạng thái thành công hoặc thất bại của hoạt động đồng bộ hóa
 */
export async function syncMedia(media, shopId) {
  try {
    const snapshot = await mediaRef.where('shopId', '==', shopId).get();
    const existingDocs = snapshot.docs.map(doc => ({id: doc.id, data: doc.data()}));
    if (!existingDocs.length) {
      const mediaData = chunkArray(media, 5);
      await setMedia(mediaData, shopId);
      return media;
    }
    return prepareUpdates(existingDocs, media, shopId, 'sync');
  } catch (error) {
    console.error('Lỗi khi đồng bộ media:', error);
    return false;
  }
}
/**
 * Thực hiện batch cập nhật hoặc thêm mới các tài liệu vào Firestore.
 *
 * @param {Map} updates - Map chứa các cập nhật hoặc tạo mới tài liệu trong Firestore
 * @returns {Promise<void>}
 */
export async function batchUpdateFirestore(updates) {
  updates.forEach((data, docId) => {
    const docRef = mediaRef.doc(docId);
    batch.set(docRef, data, {merge: true});
  });

  await batch.commit();
}

export async function deleteMedia(shopId) {
  try {
    const querySnapshot = await mediaRef.where('shopId', '==', shopId).get();
    const docs = querySnapshot.docs;

    docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();

    return {success: true};
  } catch (error) {
    console.log(error);
    return {error: 'something went wrong!'};
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
    console.log('allExistingMediaIds.size');
    console.log(allExistingMediaIds.size);
    return allExistingMediaIds.size;
  } catch (error) {
    console.error('Error getting unique media count:', error);
    throw new Error('Failed to get unique media count');
  }
}

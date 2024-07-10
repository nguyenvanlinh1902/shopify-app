import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const mediaRef = firestore.collection('media');

/**
 * Get media by shop ID
 * @param {string} shopId
 * @return {Promise<Array>}
 */
export async function getMedia(shopId) {
  try {
    const snapshot = await mediaRef.get();
    const media = [];

    snapshot.docs.forEach(doc => {
      const docData = doc.data();
      if (Array.isArray(docData.media)) {
        docData.media.forEach(mediaItem => {
          media.push({...mediaItem, shopId});
        });
      }
    });

    return media;
  } catch (error) {
    console.error('Error getting media:', error);
    return [];
  }
}

/**
 * Sync media by shop ID
 * @param {Array} mediaChunks
 * @param {string} shopId
 * @param {string} mediaType - 'IMAGE' or 'VIDEO'
 * @param {Date} expiryDate - Expiration date for the media
 * @return {Promise<boolean>}
 */
export async function syncMedia(mediaChunks, shopId, mediaType, expiryDate) {
  const batch = firestore.batch();
  try {
    mediaChunks.forEach(chunk => {
      const docRef = mediaRef.doc();
      batch.set(docRef, {
        shopId,
        media: chunk,
        mediaType,
        expiryDate: expiryDate.getTime() // Store as timestamp
      });
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error syncing media:', error);
    return false;
  }
}

/**
 * Delete expired media by shop ID
 * @param {string} shopId
 * @param {string} mediaType - 'IMAGE' or 'VIDEO'
 * @param {Date} expiryDate - Expiration date for the media
 * @return {Promise<boolean>}
 */
export async function deleteExpiredMedia(shopId, mediaType, expiryDate) {
  try {
    const expiredMediaSnapshot = await mediaRef
      .where('shopId', '==', shopId)
      .where('mediaType', '==', mediaType)
      .where('expiryDate', '<', expiryDate.getTime())
      .get();

    const batch = firestore.batch();
    expiredMediaSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error deleting expired media:', error);
    return false;
  }
}

/**
 * Delete media by shop ID
 * @param {string} shopId
 * @return {Promise<boolean>}
 */
export async function deleteMedia(shopId) {
  try {
    const snapshot = await mediaRef.where('shopId', '==', shopId).get();
    const batch = firestore.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error deleting media:', error);
    return false;
  }
}

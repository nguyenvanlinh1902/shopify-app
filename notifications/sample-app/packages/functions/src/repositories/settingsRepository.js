import {Firestore} from '@google-cloud/firestore';
import {presentDataAndFormatDate} from '@functions/helpers/utils/firestoreUtils';
import {getShopById, getShopByShopifyDomain} from '@avada/core';
import {initShopify} from '@functions/services/shopifyService';
import {decryptText} from '@avada/core/build/helpers/hashHelper';

const firestore = new Firestore();
/** @type CollectionReference */
const settingsRef = firestore.collection('settings');

/**
 * Get settings by shop ID
 *
 * @param {string} shopId
 * @return {Promise<FirebaseFirestore.DocumentData>}
 */
export async function getSettingsByShopId(shopId) {
  const shopData = await getShopById(shopId);
  const shopify =  initShopify(shopData)
  const docs = await settingsRef
    .where('shopId', '==', shopId)
    .limit(1)
    .get();
  if (docs.empty) {
    return null;
  }
  const [doc] = docs.docs;
  return presentDataAndFormatDate(doc);
}

/**
 * Update settings by shop ID
 *
 * @param {string} shopId
 * @param {object} settings
 * @return {Promise<void>}
 */
export async function updateSettingsByShopId(shopId, settings) {
  const docs = await settingsRef
    .where('shopId', '==', shopId)
    .limit(1)
    .get();
  if (docs.empty) {
    await settingsRef.add({shopId, ...settings});
  } else {
    const [doc] = docs.docs;
    await doc.ref.update(settings);
  }
}

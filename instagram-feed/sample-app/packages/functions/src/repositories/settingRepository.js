import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const settingsRef = firestore.collection('settings');

const defaultSettings = {
  title: 'Default Title',
  numberOfRows: 2,
  numberOfColumns: 4,
  postSpacing: 10,
  accessToken: '',
  accessTokenExpiry: '',
  username: ''
};

/**
 * Get settings by shop ID and save default values if none exist
 * @param {string} shopId
 * @return {Promise<FirebaseFirestore.DocumentData>}
 */
export async function getSettings(shopId) {
  try {
    const doc = await settingsRef.doc(shopId).get();
    if (!doc.exists) {
      // If settings do not exist, set default values
      await setSettings(shopId, defaultSettings);
      return defaultSettings;
    } else {
      return doc.data();
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
}

/**
 * Set settings by shop ID
 * @param {string} shopId
 * @param {Object} settings
 * @return {Promise<boolean>}
 */
export async function setSettings(shopId, settings) {
  try {
    await settingsRef.doc(shopId).set(settings, {merge: true});
    return true;
  } catch (error) {
    console.error('Error setting settings:', error);
    return false;
  }
}

/**
 *
 * @param settings
 * @param shopId
 * @returns {Promise<boolean>}
 */
export async function syncSettings(settings, shopId) {
  const updatedSettings = {
    ...(await getSettings(shopId)),
    ...settings
  };

  return setSettings(updatedSettings.shopId, updatedSettings);
}

import {getCurrentShop} from '@functions/helpers/auth';
import {getSettings, setSettings} from '@functions/repositories/settingRepository';
import {getMedia, getUniqueMediaCount} from '@functions/repositories/mediaRepository';
import {initShopify} from '../../lib/services/shopifyService';
import {getShopById} from '@avada/core';
import {getInfoMedia} from '@functions/controllers/mediaController';

/**
 * Get current settings of a shop
 *
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export async function getSettingsController(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const settings = await getSettings(shopId);
    const media = await getInfoMedia(shopId, settings.accessToken);
    if (!settings) {
      ctx.status = 500;
      ctx.body = {success: false, error: 'Internal Server Error'};
      return;
    }
    const data = {
      settings: settings,
      media: media
    };
    console.log('media');
    console.log(media);
    ctx.body = {success: true, data: data};
  } catch (error) {
    ctx.status = 500;
    ctx.body = {success: false, error: error.message};
  }
}

/**
 * Update settings of a shop
 *
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export async function updateSettingsController(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const newSettings = ctx.req.body.settings;
    const success = await setSettings(shopId, newSettings);

    // Update the metafield only if the settings are successfully saved
    if (success) {
      await syncMetaSetting(shopId, newSettings);
      ctx.body = {success: true};
    } else {
      ctx.status = 500;
      ctx.body = {success: false, error: 'Internal Server Error'};
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = {success: false, error: error.message};
  }
}

/**
 * Sync settings to shop metafield
 *
 * @param {string} shopId
 * @param {object} data
 * @returns {Promise<boolean>}
 */
export async function syncMetaSetting(shopId, data) {
  try {
    const shopData = await getShopById(shopId);
    const shopify = initShopify(shopData);
    const qtyMedia = await getUniqueMediaCount(shopId);
    // Add qtyMedia to data
    const updatedData = {
      ...data,
      qtyMedia: qtyMedia
    };

    // Check if metafield already exists
    const existingMetafields = await shopify.metafield.list({
      namespace: 'shopify_app',
      key: 'setting',
      owner_resource: 'shop'
    });

    let metafieldId;

    if (existingMetafields.length > 0) {
      // If metafield exists, update it
      metafieldId = existingMetafields[0].id;
      await shopify.metafield.update(metafieldId, {
        value: JSON.stringify(updatedData),
        type: 'json',
        description: 'Updated settings metafield'
      });
    } else {
      // If metafield does not exist, create it
      await shopify.metafield.create({
        namespace: 'shopify_app',
        key: 'setting',
        value: JSON.stringify(updatedData),
        type: 'json',
        description: 'Settings metafield for the shop',
        owner_resource: 'shop'
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to sync metafield:', error);
    return false;
  }
}

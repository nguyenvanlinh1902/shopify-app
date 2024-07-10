import {getCurrentShop} from '@functions/helpers/auth';
import {getSettings, setSettings} from '../../lib/repositories/settingRepository';
import {getMedia} from '@functions/repositories/mediaRepository';

/**
 * Get current settings of a shop
 *
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export async function getSettingsController(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const [settings, media] = await Promise.all([getSettings(shopId), getMedia(shopId)]);

    if (!settings) {
      ctx.status = 500;
      ctx.body = {success: false, error: 'Internal Server Error'};
      return;
    }
    const data = {
      settings: settings,
      media: media
    };
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

    if (!success) {
      ctx.status = 500;
      ctx.body = {success: false, error: 'Internal Server Error'};
      return;
    }

    ctx.body = {success: true};
  } catch (error) {
    ctx.status = 500;
    ctx.body = {success: false, error: error.message};
  }
}

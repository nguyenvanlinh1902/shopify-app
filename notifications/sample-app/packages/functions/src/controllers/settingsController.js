import {getCurrentShop} from '@functions/helpers/auth';
import {
  getSettingsByShopId,
  updateSettingsByShopId
} from '@functions/repositories/settingsRepository';

/**
 * Get settings by shop ID from the context
 *
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export async function getSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const settings = await getSettingsByShopId(shopId);
    ctx.body = {success: true, data: settings || {}};
  } catch (error) {
    ctx.body = {success: false, error: error.message};
  }
}

/**
 * Update settings by shop ID from the context
 *
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export async function updateSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const {body} = ctx.req;
    await updateSettingsByShopId(shopId, body);
    ctx.body = {success: true, message: 'Settings updated successfully'};
  } catch (error) {
    ctx.body = {success: false, error: error.message};
  }
}

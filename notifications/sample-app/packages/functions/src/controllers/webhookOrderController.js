import Shopify from 'shopify-api-node';
import {createNewNotification} from '../repositories/notificationRepository';
import {getShopByShopifyDomain} from '@avada/core';
import {initShopify} from '@functions/services/shopifyService';

export async function createNotification(ctx) {
  const domain = await ctx.get('X-Shopify-Shop-Domain');
  const shopData = await getShopByShopifyDomain(domain);
  const shopify = initShopify(shopData)
  console.log('notification webhook ---------------');
  const notification = await getNotification(shopify, shopData.id, ctx.req.body);
  console.log(notification);
  await createNewNotification(notification);
  ctx.body = {success: true};
}

/**
 *
 * @param shopify
 * @param id
 * @param data
 * @returns {Promise<{firstName: string, country: string, productImage: string, productId: null, city: string, shopId: string, productName: string, timestamp: (number|string)}|null>}
 */
export async function getNotification(shopify, id, data) {
  try {
    const getFormattedTimestamp = dateString =>
      dateString ? new Date(dateString).getTime() : null;

    const product = await shopify.product.get(data.line_items[0].product_id);

    return {
      firstName: data.billing_address.first_name || '',
      city: data.billing_address.city || '',
      country: data.billing_address.country || '',
      shopId: id || '',
      timestamp: getFormattedTimestamp(data.created_at) || '',
      productName: data.line_items[0].title || '',
      productId: data.line_items[0].product_id || null,
      productImage: product.image.src
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

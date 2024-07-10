import { getShopById, getShopByShopifyDomain } from '@avada/core';
import { initShopify } from '@functions/services/shopifyService';
import { createNotifications } from '@functions/repositories/notificationRepository';

/**
 * @param {object} ctx
 * @return {Promise<void>}
 */
export async function installApp(ctx) {
  try {
    const {id} = await getShopByShopifyDomain(ctx.state.shopify.shop);
    const shopData = await getShopById(id);
    const shopify = initShopify(shopData);
    const orders = await shopify.order.list({
      status: 'any',
      limit: 30
    });
    const notifications = await getNotifications(shopify, orders,id);
    await createNotifications(notifications);
  } catch (error) {
    console.error('Failed to sync orders to notifications:', error);
    throw error;
  }
}

/**
 *
 * @param shopify
 * @param orders
 * @param id
 * @returns {Promise<*>}
 */
export async function getNotifications(shopify, orders,id) {
  const getFormattedTimestamp = dateString => (dateString ? new Date(dateString).getTime() : null);

  const productIds = orders.map(order => order.line_items[0].product_id);
  const products = await shopify.product.list({ ids: productIds.join(',') });
  return orders.map(order => {
    const product = products.find(p => p.id === order.line_items[0].product_id);
    return {
      firstName: order.billing_address?.first_name || 'Linh',
      city: order.billing_address?.city || 'Ha Noi',
      country: order.billing_address?.country || 'Ha Noi',
      shopId: id || '',
      timestamp: getFormattedTimestamp(order.created_at) || '',
      productName: order.line_items[0].title || '',
      productId: order.line_items[0].product_id || null,
      productImage: product ? product.image.src : null
    };
  });
}

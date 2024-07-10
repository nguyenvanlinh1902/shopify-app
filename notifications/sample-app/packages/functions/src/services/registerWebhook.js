import {getShopById, getShopByShopifyDomain} from '@avada/core';
import {initShopify} from '@functions/services/shopifyService';

/**
 *
 * @param ctx
 * @param topic
 */
export async function registerWebhook(ctx, topic) {
  try {
    const {id} = await getShopByShopifyDomain(ctx.state.shopify.shop);
    const shopData = await getShopById(id);
    const shopify = initShopify(shopData);
    const address = 'https://688e-117-6-131-199.ngrok-free.app/webhookApi/newOrder';
    const topic = 'orders/create';

    const webhook = await shopify.webhook.create({
      topic: topic,
      address: address,
      format: 'json'
    });
    console.log('Webhook registered:', webhook);
  } catch (error) {
    console.error('Error registering webhook:', error);
    throw error;
  }
}



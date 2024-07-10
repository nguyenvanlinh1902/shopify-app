import {getShopById, getShopByShopifyDomain} from '@avada/core';
import {initShopify} from '@functions/services/shopifyService';

export async function registerScriptTag(ctx) {
  // try {
  //   const {id} = await getShopByShopifyDomain(ctx.state.shopify.shop);
  //   console.log('getShopByShopifyDomain:', id);
  //   const shopData = await getShopById(id);
  //   const shopify = initShopify(shopData);
  //   const scriptTag = await shopify.scriptTag.create({
  //     event: 'onload',
  //     src: 'https://localhost:3000/scripttag/index.min.js'
  //   });
  //   console.log('ScriptTag registered:', scriptTag);
  // } catch (error) {
  //   console.error('Error registering ScriptTag:', error);
  // }
}

export async function removeAllScriptTags(ctx) {
  try {
    const {id} = await getShopByShopifyDomain(ctx.state.shopify.shop);
    const shopData = await getShopById(id);
    const shopify = initShopify(shopData);
    console.log('shopData----------------------');
    console.log(shopData);
    const existingScriptTags = await shopify.scriptTag.list();
    for (const scriptTag of existingScriptTags) {
      await shopify.scriptTag.delete(scriptTag.id);
      console.log(`Deleted ScriptTag ID: ${scriptTag.id}`);
    }
  } catch (error) {
    console.error('Error removing ScriptTags:', error);
  }
}

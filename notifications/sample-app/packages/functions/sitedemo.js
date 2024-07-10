const Shopify = require("shopify-api-node")
 const API_VERSION = '2023-04';

async function demo() {
  const shopify = new Shopify({
    apiVersion: API_VERSION,
    accessToken: "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",
    shopName: 'mageplaza-linhnv3.myshopify.com',
    autoLimit: true
  });
  const data = await shopify.order.list();
  console.log('👉 check: ', data);
}

demo();

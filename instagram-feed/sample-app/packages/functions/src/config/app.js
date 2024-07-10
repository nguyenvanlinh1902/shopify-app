import * as functions from 'firebase-functions';

const {app} = functions.config();

export default {
  isProduction: app.env === 'production',
  baseUrl: app.base_url,
  redirectUri: app.redirectUri,
  clientId: app.client_id,
  client_secret: app.client_secret
};

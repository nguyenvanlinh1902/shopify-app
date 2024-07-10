import appRoute from '@assets/const/app';

export const isEmbeddedApp = process.env.IS_EMBEDDED_APP === 'yes';
export const clientId = '493429796492973';
// eslint-disable-next-line camelcase
export const redirectUri = 'https://localhost:3000/';
export const clientSecret = 'c45e734fff58ae4b5afa0d7d52d90bea';
export const routePrefix = isEmbeddedApp ? appRoute.embed : appRoute.standalone;
export const prependRoute = url => routePrefix + url;
export const removeRoute = url => (isEmbeddedApp ? url.replace(routePrefix, '') : url);
export const crispWebsiteId = process.env.CRISP_WEBSITE_ID;

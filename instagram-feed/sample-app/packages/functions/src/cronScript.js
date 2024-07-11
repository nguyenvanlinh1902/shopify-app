import nodeCron from 'node-cron';
import Instagram from '../src/helpers/instagram';
import {getSettings, setSettings} from './repositories/settingRepository';

const instagram = new Instagram();

// Refresh access token for a shop
const refreshAccessToken = async (shopId, accessToken) => {
  try {
    const newAccessToken = await instagram.refreshLongLivedToken(accessToken);
    const newAccessTokenExpiry = Date.now() + 60 * 60 * 24 * 60 * 1000; // 60 days validity
    const settings = {
      accessToken: newAccessToken,
      accessTokenExpiry: newAccessTokenExpiry
    };

    // Update Firebase settings
    await setSettings(shopId, settings);

    console.log(`Access token refreshed successfully for shopId: ${shopId}`);
  } catch (error) {
    console.error(`Failed to refresh access token for shopId: ${shopId}`, error);
  }
};

// Check and refresh tokens and media links every day at midnight
nodeCron.schedule('* * * * *', async () => {
  try {
    console.log('Checking and refreshing expired tokens and media...');
    const now = Date.now();

    // Check and refresh expired access tokens
    const settingsSnapshot = await getSettings();
    for (const {shopId, accessToken, accessTokenExpiry} of settingsSnapshot) {
      if (accessTokenExpiry < now) {
        await refreshAccessToken(shopId, accessToken);
      }
    }

    console.log('Completed check and refresh process');
  } catch (error) {
    console.error('Failed to refresh expired tokens and media:', error);
  }
});

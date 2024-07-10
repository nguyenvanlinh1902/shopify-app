import nodeCron from 'node-cron';
import Instagram from '../src/helpers/instagram';
import {getSettings, syncSettings} from './repositories/settingRepository';
import {getMedia, syncMedia} from './repositories/mediaRepository';
import separateMedia from './helpers/utils/separateMedia';
import {deleteExpiredMedia} from '@functions/repositories/mediaRepository';
import chunkArray from '@functions/helpers/utils/chunkArray';

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
    await syncSettings(settings, shopId);

    console.log(`Access token refreshed successfully for shopId: ${shopId}`);
  } catch (error) {
    console.error(`Failed to refresh access token for shopId: ${shopId}`, error);
  }
};

// Refresh expired media links for a shop
const refreshExpiredMediaLinks = async (shopId, accessToken) => {
  try {
    // Get media data
    const mediaData = await instagram.getMediaByAccessToken(accessToken);
    const {images, videos} = separateMedia(mediaData.data);

    // Set expiration dates for media types
    const imageExpiry = new Date();
    imageExpiry.setDate(imageExpiry.getDate() + 3); // 3 days for images

    const videoExpiry = new Date();
    videoExpiry.setDate(videoExpiry.getDate() + 1.5); // 1.5 days for videos

    // Filter expired media
    const expiredImages = images.filter(
      media => media.timestamp + 3 * 24 * 60 * 60 * 1000 < Date.now()
    ); // 3 days for images
    const expiredVideos = videos.filter(
      media => media.timestamp + 1.5 * 24 * 60 * 60 * 1000 < Date.now()
    ); // 1.5 days for videos

    // Delete expired media
    await Promise.all([
      deleteExpiredMedia(shopId, 'IMAGE', imageExpiry),
      deleteExpiredMedia(shopId, 'VIDEO', videoExpiry)
    ]);

    // Get media chunks and update Firebase media collection for new media
    const imageChunks = chunkArray(expiredImages, 5);
    const videoChunks = chunkArray(expiredVideos, 5);

    await Promise.all([
      Promise.all(imageChunks.map(chunk => syncMedia(chunk, shopId, 'IMAGE', imageExpiry))),
      Promise.all(videoChunks.map(chunk => syncMedia(chunk, shopId, 'VIDEO', videoExpiry)))
    ]);

    console.log(`Expired media links refreshed successfully for shopId: ${shopId}`);
  } catch (error) {
    console.error(`Failed to refresh expired media links for shopId: ${shopId}`, error);
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

    // Get media data and refresh expired media links
    const mediaSnapshot = await getMedia();
    for (const {shopId, accessToken, mediaExpiry} of mediaSnapshot) {
      if (mediaExpiry < now) {
        await refreshExpiredMediaLinks(shopId, accessToken);
      }
    }

    console.log('Completed check and refresh process');
  } catch (error) {
    console.error('Failed to refresh expired tokens and media:', error);
  }
});

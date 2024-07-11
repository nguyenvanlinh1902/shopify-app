import axios from 'axios';
import app from '../config/app';

class Instagram {
  constructor() {
    this.clientId = '493429796492973';
    this.clientSecret = 'c0f912db51ffa6f938018f267c111575';
    this.redirectUri = 'https://shaft-reputation-municipal-continental.trycloudflare.com';
  }

  /**
   * @param {string} code
   * @return {Promise<object>}
   */
  async getTokenByCode(code) {
    try {
      console.log('this.clientSecret-----------------------');
      console.log(this.clientSecret);
      const formData = new URLSearchParams();
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);
      formData.append('grant_type', 'authorization_code');
      formData.append('redirect_uri', 'https://localhost:3000/clientApi/getToken');
      formData.append('code', code);

      const response = await axios.post(`https://api.instagram.com/oauth/access_token`, formData, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get token by code');
    }
  }

  /**
   * @param {string} access_token
   * @return {Promise<string>} access_token
   */
  async getLongLivedTokens(access_token) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${this.clientSecret}&access_token=${access_token}`
      );

      return response.data.access_token;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get long-lived tokens');
    }
  }

  /**
   * @param {string} access_token
   * @return {Promise<object>} user
   */
  async getUserByAccessToken(access_token) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`
      );

      return {...response.data, accessToken: access_token};
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get user by access token');
    }
  }

  /**
   * @param {string} access_token
   * @return {Promise<object>} media
   */
  async getMediaByAccessToken(access_token) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type,thumbnail_url&limit=30&access_token=${access_token}`
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get media by access token');
    }
  }
  /**
   * Refresh long-lived access token
   * @param {string} accessToken
   * @return {Promise<string>} New long-lived access token
   */
  async refreshLongLivedToken(accessToken) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}&client_secret=${this.clientSecret}`
      );

      return response.data.access_token;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to refresh long-lived access token');
    }
  }
}

export default Instagram;

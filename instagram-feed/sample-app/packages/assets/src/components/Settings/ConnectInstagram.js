import React from 'react';
import {Button, Card, Link} from '@shopify/polaris';
import {LogoInstagramIcon} from '@shopify/polaris-icons';
import {clientId, redirectUri} from '../../config/app';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useCreateApi from '@assets/hooks/api/useCreateApi';

// eslint-disable-next-line react/prop-types
export default function ConnectInstagram({settings, setSettings, setMedia, media}) {
  const {handleCreate: handleLogout} = useCreateApi({url: '/logout'});
  // Fetch media data with settings accessToken
  const {fetchApi, data: mediaData} = useFetchApi({
    url: '/sync-media?token=' + settings?.accessToken
  });
  // Hàm mở popup để đăng nhập với Instagram
  const openLoginPopUp = () => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}/clientApi/getToken&scope=user_profile,user_media&response_type=code&state=${window.activeShop.id}`;
    const popup = window.open(authUrl, 'auth', 'height=500,width=400');
    const isPopUpClosed = setInterval(async () => {
      try {
        if (popup.location.href.includes('code')) {
          popup.close();
          clearInterval(isPopUpClosed);
          await fetchSettingsAndMedia();
        }
      } catch (error) {
        // handle error if needed
      }
    }, 500);
  };

  // Hàm để gọi API lấy settings và media
  const fetchSettingsAndMedia = async () => {
    try {
      const response = await fetch(
        `${redirectUri}/clientApi/getMedia?domain=${window.activeShop.domain}`
      );
      const data = await response.json();
      setSettings(data.data.settings);
      setMedia(data.data.media);
      console.log('settings', settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const logOut = async () => {
    await handleLogout();
    const updatedSettings = {
      ...settings,
      accessToken: '',
      accessTokenExpiry: '',
      username: ''
    };
    setSettings(updatedSettings);
    setMedia([]); // Clear media when logged out
  };

  const handleSyncMedia = async () => {
    try {
      await fetchApi();
      console.log('test');
      if (mediaData) {
        setMedia(mediaData);
      }
    } catch (error) {
      console.error('Error syncing media:', error);
    }
  };

  const handleChangeAccount = () => {
    openLoginPopUp();
  };

  return (
    <Card title="Instagram Feed Connection" sectioned>
      {!settings?.username ? (
        <Button icon={LogoInstagramIcon} primary onClick={openLoginPopUp}>
          Connect with Instagram
        </Button>
      ) : (
        <div>
          <strong>Connected to @{settings.username}</strong>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
            <Link onClick={handleChangeAccount}>Change Account</Link>
            <Link onClick={logOut}>Disconnect</Link>
            <Link onClick={handleSyncMedia}>Sync</Link>
          </div>
        </div>
      )}
    </Card>
  );
}

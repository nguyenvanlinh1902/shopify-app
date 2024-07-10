import React, {useEffect, useState} from 'react';
import {Page, Layout, Grid, Toast} from '@shopify/polaris';
import Settings from '@assets/components/Settings/Settings';
import Preview from '@assets/components/MainFeed/Preview';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import ConnectInstagram from '@assets/components/Settings/ConnectInstagram';

export default function InstagramFeedSettings() {
  const [settings, setSettings] = useState({
    title: '',
    numberOfRows: 2,
    numberOfColumns: 4,
    postSpacing: 5,
    accessToken: '',
    accessTokenExpiry: '',
    username: ''
  });
  const [media, setMedia] = useState([]);
  const [toastActive, setToastActive] = useState(false);

  // Fetch settings and media from API
  const {data, loading} = useFetchApi({
    url: '/settings',
    defaultData: {settings: {}, media: []}
  });

  useEffect(() => {
    if (data) {
      setSettings(
        data.settings || {
          title: '',
          numberOfRows: 2,
          numberOfColumns: 4,
          postSpacing: 5,
          accessToken: '',
          accessTokenExpiry: '',
          username: ''
        }
      );
      setMedia(data.media || []);
    }
  }, [data]);

  // Call the hook for saving settings
  const {handleEdit} = useEditApi({
    url: '/settings',
    method: 'PUT',
    onSuccess: () => {
      setToastActive(true);
    },
    onError: error => {
      console.error('Failed to save settings:', error);
    },
    successMsg: 'Settings saved successfully!',
    errorMsg: 'Failed to save settings!'
  });

  const handleSave = () => {
    handleEdit({settings});
  };

  const handleToastClose = () => setToastActive(false);

  if (loading) {
    return <Page title="Main Feed">Loading...</Page>;
  }

  return (
    <Page title="Main Feed">
      <Layout sectioned>
        <Grid>
          <Grid.Cell columnSpan={{xs: 4, sm: 4, md: 4, lg: 4, xl: 4}}>
            <ConnectInstagram
              settings={settings}
              setSettings={setSettings}
              setMedia={setMedia}
              media={media}
            />
            <Settings settings={settings} setSettings={setSettings} handleSave={handleSave} />
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 8, md: 8, sm: 8, lg: 8, xl: 8}}>
            <Preview settings={settings} media={media} />
          </Grid.Cell>
        </Grid>
      </Layout>
      {toastActive && <Toast content="Settings saved!" onDismiss={handleToastClose} />}
    </Page>
  );
}

import React, {useState, useEffect} from 'react';
import {Grid, Layout, Page, Spinner} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import TabSettings from '@assets/components/SettingsNotifications/TabSettings';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';

export default function Settings() {
  const [settings, setSettings] = useState({
    desktopPosition: 'bottom-left',
    hideTimeAgo: false,
    truncateContentText: true,
    displayDuration: 5,
    timeBeforeFirstPop: 10,
    gapTimeBetweenPops: 2,
    maximumOfPopups: 20,
    includedPages: '',
    excludedPages: '',
    allowShow: 'all'
  });

  const {data: fetchedSettings, loading} = useFetchApi({
    url: '/settings',
    defaultData: {}
  });

  const {handleEdit: saveSettings} = useEditApi({url: '/settings'});

  useEffect(() => {
    if (Object.keys(fetchedSettings).length > 0) {
      setSettings(prevSettings => ({
        ...prevSettings,
        ...fetchedSettings
      }));
    }
  }, [fetchedSettings]);

  const handleSave = async () => {
    await saveSettings(settings);
  };
  if (loading) {
    return (
      <div
        style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}
      >
        <Spinner accessibilityLabel="Loading settings" size="large" />
      </div>
    );
  }

  return (
    <Page
      title="Settings"
      subtitle="Decide how your notifications will display"
      primaryAction={{content: 'Save', onAction: handleSave}}
    >
      <Layout sectioned>
        <Grid>
          <Grid.Cell columnSpan={{xs: 4, sm: 4, md: 4, lg: 4, xl: 4}}>
            <NotificationPopup />
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 8, sm: 8, md: 8, lg: 8, xl: 8}}>
            <TabSettings settings={settings} setSettings={setSettings} />
          </Grid.Cell>
        </Grid>
      </Layout>
    </Page>
  );
}
